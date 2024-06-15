#include "../include/http_server.h"

http_connection::http_connection(tcp::socket socket):
    m_socket(std::move(socket))
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
        m_response.set(http::field::server, "beast");
        create_response();
    }
    else if (m_request.method() == http::verb::post && m_request.target() == "/shutdown")
    {
        m_response.result(http::status::ok);
        m_response.set(http::field::content_type, "text/plain");
        beast::ostream(m_response.body()) << "Server is shutting down...";
        write_response();
        std::exit(0);
    }
    else
    {
        m_response.result(http::status::bad_request);
        m_response.set(http::field::content_type, "text/plain");
        beast::ostream(m_response.body())
                << "Invalid request-method '"
                << std::string(m_request.method_string())
                << "'";
    }
    write_response();
}

void http_connection::create_response()
{
    auto const target = m_request.target();
    if (target == "/authorize")
    {
        auto const encoded = m_request.at(http::field::authorization);
        // tOd0 db
    }
    else if (target == "/image")
    {
        // t0d0 db
    }
    else if (target == "/info")
    {

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

void http_server(tcp::acceptor &acceptor, tcp::socket &socket)
{
    acceptor.async_accept(
        socket,
        [&](beast::error_code ec)
        {
            if (!ec)
            {
                std::make_shared<http_connection>(std::move(socket))->start();
            }
            http_server(acceptor, socket);
        });
}