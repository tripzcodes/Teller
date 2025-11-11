add_library(extractor STATIC
    transaction_extractor.cpp
)

target_include_directories(extractor PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(extractor
    pdf_parser
)
