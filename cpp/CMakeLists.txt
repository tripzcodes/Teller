cmake_minimum_required(VERSION 3.20)
project(BankStatementAnalyzer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten-specific settings
if(EMSCRIPTEN)
    message(STATUS "Building with Emscripten")

    # Emscripten compiler flags
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ALLOW_MEMORY_GROWTH=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap']")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MODULARIZE=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s EXPORT_NAME='BankAnalyzerModule'")

    # Enable embind for C++ <-> JavaScript bindings
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --bind")

    # Enable exceptions (needed for PDF parsing)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s DISABLE_EXCEPTION_CATCHING=0")

    # Optimization flags (use -O3 for production)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O2")
else()
    message(STATUS "Building natively (for testing)")
endif()

# Include directories
include_directories(${CMAKE_SOURCE_DIR}/src)

# Add subdirectories for each module
add_subdirectory(src/pdf_parser)
add_subdirectory(src/extractor)
add_subdirectory(src/analyzer)
add_subdirectory(src/bindings)

# Main WASM library
add_executable(bank_analyzer
    src/bindings/main.cpp
)

target_link_libraries(bank_analyzer
    pdf_parser
    extractor
    analyzer
)

# Emscripten output settings
if(EMSCRIPTEN)
    set_target_properties(bank_analyzer PROPERTIES
        OUTPUT_NAME "bank_analyzer"
        SUFFIX ".js"
    )

    # Copy output to frontend public directory
    add_custom_command(TARGET bank_analyzer POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy
        ${CMAKE_BINARY_DIR}/bank_analyzer.js
        ${CMAKE_SOURCE_DIR}/../frontend/public/wasm/bank_analyzer.js
        COMMAND ${CMAKE_COMMAND} -E copy
        ${CMAKE_BINARY_DIR}/bank_analyzer.wasm
        ${CMAKE_SOURCE_DIR}/../frontend/public/wasm/bank_analyzer.wasm
        COMMENT "Copying WASM files to frontend"
    )
endif()
