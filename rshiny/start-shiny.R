# Script that starts the shiny webserver
# Parameters are supplied using environment variables
# assign(".lib.loc", Sys.getenv("R_LIB_PATHS"), envir = environment(.libPaths))
shiny::runApp(paste0(path.expand('~'), "/.douhau-data-studio/rshiny/app"),
  host = "127.0.0.1",
  launch.browser = FALSE,
  port = 8181
)
