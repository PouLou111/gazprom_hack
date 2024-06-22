#include "../include/http_server.h"

http_connection::http_connection(tcp::socket socket, std::shared_ptr<database_manager> const &manager):
    m_socket(std::move(socket)), m_manager(manager)
{

}

void http_connection::start()
{
    read_request();
    check_deadline();
}

void http_connection::read_request()
{
    auto self = shared_from_this();

    http::async_read(
        m_socket,
        m_buffer,
        m_request,
        [self](beast::error_code ec, std::size_t bytes_transferred)
        {
            boost::ignore_unused(bytes_transferred);
            if (!ec)
            {
                self->process_request();
            }
        });
}

void http_connection::process_request()
{
    m_response.version(m_request.version());
    m_response.keep_alive(false);

    if (m_request.method() == http::verb::get)
    {
        m_response.result(http::status::ok);
        m_response.set(http::field::server, BOOST_BEAST_VERSION_STRING);
        create_response();
    }
    else if (m_request.method() == http::verb::post && m_request.target() == "/shutdown")
    {
        std::exit(0);
    }
    else
    {
        m_response.result(http::status::bad_request);
        m_response.set(http::field::content_type, "text/plain");
        beast::ostream(m_response.body()) << "Invalid request-method '" << std::string(m_request.method_string()) << "'";
    }
    write_response();
}

void http_connection::create_response()
{
    auto const target = m_request.target();
    if (target == "/authorize")
    {
        try
        {
            auto decoded = decode_base64();
            std::string json = m_manager->commit(std::string("SELECT * FROM users WHERE login='" + decoded.first + "' AND password='" + decoded.second + "\';"));
            m_response.set(http::field::content_type, "application/json");
            beast::ostream(m_response.body()) << json;
        }
        catch (std::exception const &exception)
        {
            std::cout << exception.what();
            m_response.result(http::status::not_found);
            m_response.set(http::field::content_type, "text/plain");
            beast::ostream(m_response.body()) << "user not found";
        }
    }
    else if (target == "/image")
    {
        auto images_address = execute_python(std::string("python3 script.py " + at(http::field::body)).c_str());
        m_response.set(http::field::content_type, "text/plain");
        beast::ostream(m_response.body()) << images_address;
    }
    else if (target == "/info")
    {
        std::string json = m_manager->commit("SELECT * FROM clients WHERE id=" + at(http::field::body) + ";");
        m_response.set(http::field::content_type, "application/json");
        beast::ostream(m_response.body()) << json;
    }
    else
    {
        m_response.result(http::status::not_found);
        m_response.set(http::field::content_type, "text/plain");
        beast::ostream(m_response.body()) << "target not found";
    }
}

void http_connection::write_response()
{
    auto self = shared_from_this();

    http::async_write(
        m_socket,
        m_response,
        [self](beast::error_code ec, std::size_t)
        {
            self->m_socket.shutdown(tcp::socket::shutdown_send, ec);
            self->m_deadline.cancel();
        });
}

void http_connection::check_deadline()
{
    auto self = shared_from_this();

    m_deadline.async_wait(
        [self](beast::error_code ec)
        {
           if (!ec)
           {
               self->m_socket.close(ec);
           }
        });
}

std::string http_connection::at(http::field field) const
{
    auto view = m_request.at(field);
    return {view.begin(), view.end()};
}

std::pair<std::string, std::string> http_connection::decode_base64() const
{
    auto base64 = at(http::field::authorization);
    std::string login_password;
    login_password.resize(beast::detail::base64::decoded_size(base64.size()) - 1);
    beast::detail::base64::decode(&login_password[0], base64.c_str(), base64.size());
    auto delimiter_position = login_password.find(':');

    return std::make_pair(login_password.substr(0, delimiter_position), login_password.substr(delimiter_position + 1));
}

std::string http_connection::execute_python(char const *cmd)
{
    std::array<char, 128> buffer{};
    std::string result;

    std::unique_ptr<FILE, decltype(&pclose)> pipe(popen(cmd, "r"), pclose);
    if (pipe == nullptr)
    {
        throw std::runtime_error("popen() failed!");
    }

    while (fgets(buffer.data(), buffer.size(), pipe.get()) != nullptr)
    {
        result += buffer.data();
    }

    return result;
}

void http_server(tcp::acceptor &acceptor, tcp::socket &socket, std::shared_ptr<database_manager> const &manager)
{
    acceptor.async_accept(
        socket,
        [&](beast::error_code ec)
        {
            if (!ec)
            {
                std::make_shared<http_connection>(std::move(socket), manager)->start();
            }
            http_server(acceptor, socket, manager);
        });
}