cmake_minimum_required(VERSION 3.21)
project(hack_back)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Boost 1.74 REQUIRED COMPONENTS system thread)

include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${Boost_INCLUDE_DIRS})

file(GLOB SOURCES "${CMAKE_SOURCE_DIR}/src/*.cpp")

add_executable(server ${CMAKE_SOURCE_DIR}/server.cpp ${SOURCES})
target_link_libraries(server ${Boost_LIBRARIES})

add_executable(client ${CMAKE_SOURCE_DIR}/client.cpp ${SOURCES})
target_link_libraries(client ${Boost_LIBRARIES})