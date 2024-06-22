#include <iostream>
#include <http_server.h>

int main(int argc, char **argv)
{
    try
    {
        if(argc != 3)
        {
            std::cerr << "Usage: " << argv[0] << " <address> <port>\n";
            std::cerr << "  For IPv4, try:\n";
            std::cerr << "    receiver 0.0.0.0 80\n";
            std::cerr << "  For IPv6, try:\n";
            std::cerr << "    receiver 0::0 80\n";
            return 1;
        }

        auto const address = net::ip::make_address(argv[1]);
        auto port = static_cast<unsigned short>(std::atoi(argv[2]));

        net::io_context ioc{1};

        tcp::acceptor acceptor{ioc, {address, port}};
        tcp::socket socket{ioc};

        auto manager = database_manager::get_manager("gazprom_hack", "postgres", "1234", 5432);
        http_server(acceptor, socket, manager);

        ioc.run();
    }
    catch (std::exception const &e)
    {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
    return 0;
}
