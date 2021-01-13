#pragma once


#include "../lib/asio/asio.hpp"
#include "../lib/asio/asio/ts/buffer.hpp"
#include "../lib/asio/asio/ts/internet.hpp"

using namespace asio;

struct NetworkConnection{

    error_code ec;
    io_context ctx;
};
