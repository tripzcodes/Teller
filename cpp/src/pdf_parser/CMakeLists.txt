add_library(pdf_parser STATIC
    pdf_parser.cpp
)

target_include_directories(pdf_parser PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)
