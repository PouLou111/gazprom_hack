#ifndef GAZPROM_HACK_BACKEND_DATABASE_MANAGER_H
#define GAZPROM_HACK_BACKEND_DATABASE_MANAGER_H

#include <pqxx/pqxx>
#include <nlohmann/json.hpp>

class database_manager final
{

public:
    static std::shared_ptr<database_manager> get_manager(std::string const &db_name, std::string const &user, std::string const &password, std::uint16_t port);
    std::string commit(std::string const &query);

private:
    explicit database_manager(std::string const &db_name, std::string const &user, std::string const &password, std::uint16_t port);

public:
    ~database_manager();
    database_manager(database_manager const &) = delete;
    database_manager(database_manager &&) = delete;

private:
    pqxx::connection m_connection;


};

#endif //GAZPROM_HACK_BACKEND_DATABASE_MANAGER_H
