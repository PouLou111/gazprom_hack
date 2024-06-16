#include "database_manager.h"

database_manager::database_manager(std::string const &db_name, std::string const &user, std::string const &password, std::string const &ip_address, std::uint16_t port):
    m_connection("dbname=" + db_name + " user=" + user + " password=" + password + " ip_address=" + " port=" + std::to_string(port))
{

}

template<typename T, typename... Args>
void database_manager::insert_into(std::string const &table_name, std::string const &arg_names, T const &first, Args... args)
{
    std::string query = "INSERT INTO " + table_name + " " + arg_names + " VALUES" + " (" + create_query(first, args...).pop_back() + ')';

    pqxx::work work(m_connection);
    work.exec(query);
    work.commit();
}

std::string database_manager::get_from(std::string const &table_name, std::string const &column_name, std::string const &search_by)
{
    pqxx::work txn(m_connection);
    auto query_result = txn.exec_params("SELECT * FROM " + table_name + " WHERE " + column_name + " = $1", create_string(search_by));

    if (query_result.size() != 1)
    {
        throw std::logic_error("ID not found or duplicate key found");
    }

    nlohmann::json json_result;
    for (auto const &field: query_result[0])
    {
        json_result[field.name()] = field.c_str();
    }

    return json_result.dump();
}

std::string database_manager::get_from(std::string const &table_name, std::string const &column_name, unsigned int search_by)
{
    return get_from(table_name, column_name, std::to_string(search_by));
}

template<typename T, typename... Args>
void database_manager::create_query(T const &first, Args... args)
{
    std::string result = create_string(first) + ',';
    return result + create_query(args...);
}

template<typename T>
std::string database_manager::create_string(T const &value)
{
    return std::to_string(value);
}

std::string database_manager::create_string(std::string const &value)
{
    return "'" + value + "'";
}

std::string database_manager::create_string(char const *value)
{
    return create_string(std::string{value});
}
