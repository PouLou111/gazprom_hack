#ifndef GAZPROM_HACK_BACKEND_DATABASE_MANAGER_H
#define GAZPROM_HACK_BACKEND_DATABASE_MANAGER_H

#include <pqxx/pqxx>
#include <nlohmann/json.hpp>

class database_manager final
{

public:
    explicit database_manager(std::string const &db_name, std::string const &user, std::string const &password, std::string const &ip_address, std::uint16_t port);

public:
    template<typename T, typename ...Args>
    void insert_into(std::string const &table_name, std::string const &arg_names, T const &first, Args... args);

    std::string get_from(std::string const &table_name, std::string const &column_name, std::string const &search_by);
    std::string get_from(std::string const &table_name, std::string const &column_name, unsigned int search_by);

private:
    template<typename T, typename ...Args>
    static void create_query(T const &first, Args... args);

private:
    template<typename T>
    static std::string create_string(T const &value);
    static std::string create_string(std::string const &value);
    static std::string create_string(char const *value);

private:
    pqxx::connection m_connection;


};

#endif //GAZPROM_HACK_BACKEND_DATABASE_MANAGER_H
