#ifndef HACK_BACK_HTTP_SERVER_H
#define HACK_BACK_HTTP_SERVER_H

#include <array>
#include <boost/beast/core.hpp>
#include <boost/beast/core/detail/base64.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/asio.hpp>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <memory>
#include <string>

#include "database_manager.h"

namespace beast = boost::beast;         // from <boost/beast.hpp>
namespace http = beast::http;           // from <boost/beast/http.hpp>
namespace net = boost::asio;            // from <boost/asio.hpp>
using tcp = boost::asio::ip::tcp;       // from <boost/asio/ip/tcp.hpp>

class http_connection final:
    public std::enable_shared_from_this<http_connection>
{

public:
    explicit http_connection(tcp::socket socket, std::shared_ptr<database_manager> const &manager);

public:
    void start();

private:
    void read_request();
    void process_request();
    void create_response();
    void write_response();
    void check_deadline();

private:
    inline std::string at(http::field field) const;
    std::pair<std::string, std::string> decode_base64() const;

private:
    static std::string execute_python(char const *cmd);

private:
    tcp::socket m_socket;
    beast::flat_buffer m_buffer{8192};
    http::request<http::dynamic_body> m_request;
    http::response<http::dynamic_body> m_response;
    net::steady_timer m_deadline{m_socket.get_executor(), std::chrono::seconds(60)};
    std::shared_ptr<database_manager> m_manager;

};

void http_server(tcp::acceptor &acceptor, tcp::socket &socket, std::shared_ptr<database_manager> const &manager);

#endif //HACK_BACK_HTTP_SERVER_H
