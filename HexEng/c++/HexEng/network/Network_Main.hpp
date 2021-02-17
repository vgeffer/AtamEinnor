#pragma once


#include "../lib/asio/asio.hpp"
#include "../lib/asio/asio/ts/buffer.hpp"
#include "../lib/asio/asio/ts/internet.hpp"

using namespace asio;

struct NetworkConnection{

    error_code ec;
    io_context ctx;
    ip::tcp::endpoint ep;
    ip::tcp::socket sckt;

};


struct NetConnProperties {

    char ipv4[15];

};


int CreateNetworkConnection(NetConnProperties* prop, NetworkConnection* con);
