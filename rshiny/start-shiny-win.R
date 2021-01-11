# Script that starts the shiny webserver
# Parameters are supplied using environment variables

#.libPaths("C:/Users/ippei/Documents/R/win-library/4.0")
.libPaths( Sys.getenv()['R_LIBS_USER'][[1]] )

shiny::runApp(
  paste0("C:/Users/", Sys.info()[["user"]], "/.douhau-data-studio/rshiny/app"),
  host = "127.0.0.1",
  launch.browser = FALSE,
  port = 8181
)
