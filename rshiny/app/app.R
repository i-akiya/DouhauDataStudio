#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(shinydashboard)
library(dplyr)
library(stringr)
library(SASxport)
library(R4DSXML)
library(R.utils)
library(yaml)

source(paste0(getwd(), "/functions/DouhauUtils.R"))

ui <- dashboardPage(dashboardHeader(title = "Douhua Data Studio"),
                    dashboardSidebar(sidebarMenu(
                        id = "tabs",
                        menuItem("Dashboard", tabName = "dashboard", icon = icon("dashboard")),
                        menuItem("Datasets", tabName = "datasets", icon = icon("th")),
                        menuItem("Data Definitions", tabName = "data_def", icon = icon("edit")),
                        #selectInput("selectedDF", "Choose a dataset:", choices = flist, selectize = T)
                        sidebarMenuOutput("menu")
                    )),
                    dashboardBody(tags$head(tags$style(HTML('
                        h1, h2, h3 {
                            margin-top: 10px;
                            margin-bottom: 10px;
                        }
                        .info-box-text, .info-box-number{
                            text-transform: none;
                            display: block;
                            font-size: 24px;
                            font-weight: 500;
                            white-space: nowrap;
                            overflow: visible;
                            text-overflow: ellipsis;
                        }
                    '))),
                    tabItems(
                        # First tab content
                        tabItem(tabName = "dashboard",
                                span(h3(textOutput("StudyName"))),
                                span(p( textOutput("StudyDescription"))),
                                
                                fluidRow(
                                    # A static valueBox
                                    infoBoxOutput("standardName"),
                                    infoBoxOutput("numberOfDatasets"),
                                ),
                                fluidRow(
                                    # Number of Subjects
                                    infoBoxOutput("numberOfSubjects"),
                                    # Number of Adverse Events
                                    infoBoxOutput("numberOfAes"),
                                    # Number of Deaths
                                    infoBoxOutput("numberOfDeaths")
                                ),
                                fluidRow(
                                    box(
                                        width = 6, status = "info",
                                        title = "List of Files",
                                        tableOutput("filelistTable")
                                    ),
                                    box(
                                        width = 6, status = "info",
                                        title = "Trial Summary",
                                        tableOutput("tsTable")
                                    )
                                )
                        ),
                        tabItem(
                            tabName = "datasets",
                            selectInput("selectedDF", "Choose a dataset:", choices = NULL, selectize = T),
                            DT::dataTableOutput('ex1')
                        ),
                        tabItem(
                            tabName = "data_def",
                            tabsetPanel(type = "tabs",
                                        tabPanel("Dataset Metadata",  DT::dataTableOutput('datasetMetadataTable')),
                                        tabPanel("Variable Metadata", DT::dataTableOutput('variableMetadataTable')),
                                        tabPanel("Value Level Metadata", DT::dataTableOutput('valueLevelMetadataTable')),
                                        tabPanel("Codelist", DT::dataTableOutput('codelistTable'))
                            ) 
                            )
                    )))


# Define server logic
server <- function(input, output, session) {
    
    observe({
        query <- parseQueryString(session$clientData$url_search)
        
        if (!is.null(query[['id']])) {
            output$dsname1 <- renderText(query[['id']])
            output$dsname2 <- renderText(paste0(path.expand("~"), "/.douhau-data-studio.yaml"))
            baseDir <<- getDataDir(query[['id']])
        }else{
            baseDir <<- "/Users/ippei/develop/data/cdisc/sdtm"
        }
        studyInfo <<- getStudyInfo(baseDir)
        flist <<- getDatasetFileList(baseDir)
        length.flist <<- length(flist)
        
        output$StudyName <- renderText( studyInfo["StudyName"] )
        output$StudyDescription <- renderText( studyInfo["StudyDescription"] )
        
        updateSelectInput(session, "selectedDF",
                          #label = paste("Select input label", length(x)),
                          choices = flist
        )
    })
    
    
    
    output$ex1 <- DT::renderDataTable(DT::datatable(
        getDataset(baseDir, input$selectedDF),
        filter = 'top',
        extensions = 'Scroller',
        options = list(scrollX = TRUE, scrollY = "calc(100vh - 320px)", scroller = TRUE, 
                       paging = TRUE, pageLength = 10,
                       autoWidth = TRUE),
        ,callback = DT::JS("setTimeout(function() { table.draw(true); }, 500);")))
    
    # Standard Name infobox
    output$standardName <- renderInfoBox({
        infoBox(
            studyInfo["ModelName"], paste0(unname(studyInfo["StandardName"]), " ", studyInfo["StandardVersion"]), 
            icon = icon("credit-card"),
            color = "purple"
        )
    })
    # Number of Datasets infobox
    output$numberOfDatasets <- renderInfoBox({
        infoBox(
            "Number of Datasets", length(flist), 
            icon = icon("credit-card"), 
            color = "purple"
        )
    })
    # Number of Subjects infobox
    output$numberOfSubjects <- renderInfoBox({
        infoBox(
            "Subjects", getNumberOfSubjects(unname(studyInfo["StandardName"]), baseDir), 
             icon = icon("users"), 
             color = "light-blue"
        )
    })
    # Number of Adverse Events infobox
    output$numberOfAes <- renderInfoBox({
        infoBox(
            "AEs", getNumberOfAes(unname(studyInfo["StandardName"]), baseDir), 
             icon = icon("user-injured"), 
             color = "orange"
        )
    })
    # Number of Deaths infobox
    output$numberOfDeaths <- renderInfoBox({
        infoBox(
            "Deaths", getNumberOfDeaths(unname(studyInfo["StandardName"]), baseDir), 
             icon = icon("user-alt-slash"), 
             color = "red"
        )
    })
    
    # generate filelist table
    output$filelistTable <- renderTable(getDatasetFileInfo(baseDir), width="100%")
    
    # generate trial summary table
    output$tsTable <- renderTable(getTrialSummary(baseDir), width="100%")
    
    # generate trial summary table
    output$datasetMetadataTable <- DT::renderDataTable(DT::datatable(
        getDatasetMetadata(baseDir),
        filter = 'top',
        extensions = 'Scroller',
        options = list(scrollX = TRUE, scrollY = "calc(100vh - 285px)", scroller = TRUE, 
                       paging = TRUE, pageLength = 10,
                       autoWidth = TRUE),
        ,callback = DT::JS("setTimeout(function() { table.draw(true); }, 500);")))
    
    output$variableMetadataTable <- DT::renderDataTable(DT::datatable(
        getVariableMetadata(baseDir),
        filter = 'top',
        extensions = 'Scroller',
        options = list(scrollX = TRUE, scrollY = "calc(100vh - 285px)", scroller = TRUE, 
                       paging = TRUE, pageLength = 10,
                       autoWidth = TRUE),
        ,callback = DT::JS("setTimeout(function() { table.draw(true); }, 500);")))
    
    output$valueLevelMetadataTable <- DT::renderDataTable(DT::datatable(
        getValueLevelMetadata(baseDir),
        filter = 'top',
        extensions = 'Scroller',
        options = list(scrollX = TRUE, scrollY = "calc(100vh - 285px)", scroller = TRUE, 
                       paging = TRUE, pageLength = 10,
                       autoWidth = TRUE),
        ,callback = DT::JS("setTimeout(function() { table.draw(true); }, 500);")))
    
    output$codelistTable <- DT::renderDataTable(DT::datatable(
        getCodelist(baseDir),
        filter = 'top',
        extensions = 'Scroller',
        options = list(scrollX = TRUE, scrollY = "calc(100vh - 285px)", scroller = TRUE, 
                       paging = TRUE, pageLength = 10,
                       autoWidth = TRUE, columnDefs = list(list(width = '100px', targets = c(3)))),
        ,callback = DT::JS("setTimeout(function() { table.draw(true); }, 500);")))

}

# Run the application
shinyApp(ui = ui, server = server)
