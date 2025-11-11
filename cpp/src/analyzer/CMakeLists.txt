add_library(analyzer STATIC
    analyzer.cpp
)

target_include_directories(analyzer PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)
