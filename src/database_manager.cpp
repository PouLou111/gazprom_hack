#include "database_manager.h"

std::shared_ptr<database_manager> database_manager::get_manager(std::string const &db_name, std::string const &user, std::string const &password, std::uint16_t port)
{
    static std::shared_ptr<database_manager> db_manager(new database_manager(db_name, user, password, port));
    return db_manager;
}

std::string database_manager::commit(std::string const &query)
{
    pqxx::work transaction(m_connection);
    auto query_result = transaction.exec(query);
    transaction.commit();

    if (query_result.empty())
    {
        throw std::runtime_error("User not found");
    }

    nlohmann::json json_result;
    for (auto const &row: query_result)
    {
        nlohmann::json json_row;
        for (auto const &field: row)
        {
            json_row[field.name()] = field.c_str();
        }
        json_result.push_back(json_row);
    }

    return json_result.dump();
}

database_manager::database_manager(std::string const &db_name, std::string const &user, std::string const &password, std::uint16_t port):
    m_connection("dbname=" + db_name + " user=" + user + " password=" + password + " host=localhost" + " port=" + std::to_string(port))
{

}

database_manager::~database_manager()
{
    m_connection.close();
}

//template<typename T, typename... Args>
//void database_manager::insert_into(std::string const &table_name, std::string const &arg_names, T const &first, Args... args)
//{
//    std::string query = "INSERT INTO " + table_name + " " + arg_names + " VALUES" + " (" + create_query(first, args...).pop_back() + ')';
//
//    pqxx::work work(m_connection);
//    work.exec(query);
//    work.commit();
//}
