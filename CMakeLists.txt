cmake_minimum_required(VERSION 3.10)
project(gazprom_hack_backend)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Boost REQUIRED COMPONENTS system thread)
find_package(nlohmann_json 3.2.0 REQUIRED)
find_library(PQXX_LIBRARY pqxx)
find_library(PQ_LIBRARY pq)

if (NOT PQXX_LIBRARY)
    message(FATAL_ERROR "libpqxx not found")
endif()

if (NOT PQ_LIBRARY)
    message(FATAL_ERROR "libpq not found")
endif()

include_directories(${Boost_INCLUDE_DIRS})
include_directories(${nlohmann_json_INCLUDE_DIRS})
include_directories(/usr/include/libpqxx)
include_directories(/usr/include/postgresql)
include_directories(${CMAKE_SOURCE_DIR}/include)

add_library(
        gazprom_hack_backend
        src/http_server.cpp
        src/database_manager.cpp
)

target_include_directories(
        gazprom_hack_backend
        PUBLIC
        ./include
)

target_link_libraries(
        gazprom_hack_backend
        PUBLIC
        ${Boost_LIBRARIES}
        nlohmann_json::nlohmann_json
        ${PQXX_LIBRARY}
        ${PQ_LIBRARY}
)

set_target_properties(
        gazprom_hack_backend PROPERTIES
        LANGUAGES CXX
        LINKER_LANGUAGE CXX
        CXX_STANDARD 17
        CXX_STANDARD_REQUIRED ON
        CXX_EXTENSIONS OFF
        VERSION 1.0
        DESCRIPTION "backend"
)

add_executable(
        server
        server.cpp
)

target_link_libraries(
        server
        PUBLIC
        gazprom_hack_backend
)

set_target_properties(
        server PROPERTIES
        LANGUAGES CXX
        LINKER_LANGUAGE CXX
        CXX_STANDARD 17
        CXX_STANDARD_REQUIRED ON
        CXX_EXTENSIONS OFF
        VERSION 1.0
        DESCRIPTION "server"
)

add_executable(
        client
        client.cpp
)

target_link_libraries(
        client
        PUBLIC
        gazprom_hack_backend
)

set_target_properties(
        client PROPERTIES
        LANGUAGES CXX
        LINKER_LANGUAGE CXX
        CXX_STANDARD 17
        CXX_STANDARD_REQUIRED ON
        CXX_EXTENSIONS OFF
        VERSION 1.0
        DESCRIPTION "client"
)
