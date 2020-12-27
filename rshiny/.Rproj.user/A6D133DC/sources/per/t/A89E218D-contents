getDataDir <- function(studySpaceId){
        yamlPath <- paste0(path.expand("~"), "/.douhau-data-studio/data-src-list.yaml")
        dataSrcList <- read_yaml(yamlPath)
        dataDir <- ""
        
        for(i in 1:length(dataSrcList)){
                if( dataSrcList[[i]]$id == studySpaceId){
                        dataDir <- dataSrcList[[i]]$dataSource
                }
        }
        return(dataDir)
}

getNumberOfSubjects <- function( standardName, baseDir ){
        if( stringr::str_detect(standardName, regex("sdtm", ignore_case = TRUE)) ){
                if(file.exists( paste0(baseDir, "/dm.xpt"))){
                        dm <- SASxport::read.xport(paste0(baseDir, "/dm.xpt"))
                        res <- nrow(dm)
                } 
                else if(file.exists(paste0(baseDir, "/dm.xml"))){
                        dm <- R4DSXML::read.dataset.xml( paste0(baseDir, "/dm.xml"), paste0(baseDir, "/", getDefineXml(baseDir)))
                        res <- nrow(dm)
                }
        }
        else if( stringr::str_detect(standardName, regex("adam", ignore_case = TRUE)) ){
                res <- -99       
        }
        else{
                res <- -99       
        }
        return(res)
}


getNumberOfAes <- function( standardName, baseDir ){
        if( stringr::str_detect(standardName, regex("sdtm", ignore_case = TRUE)) ){
                if(file.exists( paste0(baseDir, "/ae.xpt"))){
                        ae <- SASxport::read.xport(paste0(baseDir, "/ae.xpt"))
                        res <- nrow(ae)
                } 
                else if(file.exists(paste0(baseDir, "/ae.xml"))){
                        ae <- R4DSXML::read.dataset.xml( paste0(baseDir, "/ae.xml"), paste0(baseDir, "/", getDefineXml(baseDir)))
                        res <- nrow(ae)
                }
                else{
                        res <- "AE dataset does not exist."
                }
        }
        else if( stringr::str_detect(standardName, regex("adam", ignore_case = TRUE)) ){
                return(-99)       
        }
        else{
                return(-99)       
        }
}


getNumberOfDeaths <- function( standardName, baseDir ){
        if( stringr::str_detect(standardName, regex("sdtm", ignore_case = TRUE)) ){
                if(file.exists( paste0(baseDir, "/dm.xpt"))){
                        dm <- SASxport::read.xport(paste0(baseDir, "/dm.xpt"))
                } 
                else if(file.exists(paste0(baseDir, "/dm.xml"))){
                        dm <- R4DSXML::read.dataset.xml( paste0(baseDir, "/dm.xml"), paste0(baseDir, "/", getDefineXml(baseDir)))
                }
                if (exists("dm")){
                        if ("DTHFL" %in% names(dm)){
                                res <- dm %>% 
                                dplyr::filter( DTHFL=="Y" ) %>% 
                                dplyr::count()
                        }else{
                                res <- "DTHFL variable does not exist."
                        }
                }
                else {
                        res <- "error"
                }
        }
        else if( stringr::str_detect(standardName, regex("adam", ignore_case = TRUE)) ){
                return(-99)       
        }
        else{
                return(-99)       
        }
}



getDatasetFileInfo <- function( baseDir ){
        #flist_ <- list.files(baseDir, pattern = "//.xpt", full.names = TRUE)
        flist <- list.files(baseDir, full.names = TRUE)
        
        #definefilelist <-  list.files(baseDir, pattern = ".*define.*\\.xml$", full.names = TRUE)
        
        #flist <- setdiff(flist_, definefilelist)
        
        if (length(flist) > 0){
                res  <- file.info(flist) %>% 
                        tibble::rownames_to_column(var = "rowname") %>% 
                        dplyr::select(rowname, size, mtime) %>% 
                        dplyr::mutate(rowname = basename(rowname)) %>% 
                        dplyr::mutate(size = R.utils::hsize(size)) %>% 
                        dplyr::mutate(mtime = format(mtime)) %>% 
                        dplyr::rename(Name=rowname, Size=size, Created=mtime)
        }else{
                res <- c("A dataset file is not found.")
        }
        return(res)
}


getTrialSummary <- function( baseDir ){
        
        if(file.exists( paste0(baseDir, "/ts.xpt"))){
                ts <- SASxport::read.xport(paste0(baseDir, "/ts.xpt"))
        } 
        else if(file.exists(paste0(baseDir, "/ts.xml"))){
                ts <- R4DSXML::read.dataset.xml( paste0(baseDir, "/ts.xml"), paste0(baseDir, "/", getDefineXml(baseDir)))
        }
        
        if(exists("ts")){
                res  <- ts %>% 
                        dplyr::select(TSPARM, TSVAL) %>% 
                        dplyr::rename(Key=TSPARM, Value=TSVAL)
        }else{
                res <- "TS dataset does not exist."
        }
        
        return(res)
}




getDatasetMetadata <- function( baseDir ){
        
        definefilelist <-  list.files(baseDir, pattern = ".*define.*\\.xml$", full.names = TRUE)
        if ( length(definefilelist) == 0 ){
                return("Error: Define.xml is not found.")
        }else{
                definexml <- definefilelist[1]
                datasetMetadata <- R4DSXML::getDLMD(definexml) %>% 
                        select(c(IGD_SASDatasetName, IGD_Description, IGD_Class, IGD_Structure))
                return(datasetMetadata)
                
        }
}

getDefineXml <- function(baseDir){
        definefilelist <-  list.files(baseDir, pattern = ".*define.*\\.xml$", full.names = FALSE)
        if ( length(definefilelist) > 0 ){
                return( definefilelist[1] )
        }
        else{
                return( NA )
        }
}

# return the full file path as string
getStudyInfo <- function( baseDir ){
        defineXml <- getDefineXml( baseDir )
        if ( is.na(defineXml) == FALSE ){
                studyMD <- R4DSXML::getStudyMD( paste0(baseDir, "/", defineXml))
                if ( studyMD["StandardName"] == "SDTM-IG") {
                        modelName <- "SDTM"
                        names(modelName) <- "ModelName"
                        studyMD_ <- c(studyMD, modelName)
                }

        }
        return(studyMD_)
}

#' Get dataset file list under basedir
#'
#' @param basedir A string
#' @return file list as string vector
getDatasetFileList <- function(baseDir){
        definefilelist <- getDefineXml(baseDir) 
        xptflist_ <- list.files(baseDir, pattern = "\\.xpt", full.names = FALSE)
        xmlflist_ <- list.files(baseDir, pattern = "\\.xml", full.names = FALSE)
        
        if(length(xptflist_) > 0 ){
                #xpt
                return(xptflist_)
        }else if(length(xptflist_) == 0 && length(xmlflist_) > 0){
                #xml
                flist <- setdiff(xmlflist_, definefilelist)
                return(flist)
        }
}


#' Get dataset
#'
#' @param baseDir A string of base directory
#' @param file A string of file name without directory path
#' @return dataset as an R dataframe
getDataset <- function(baseDir, filename){
        definefilelist <- getDefineXml(baseDir)
        
        if ( stringr::str_sub(filename, -4) == ".xpt" ){
                df <- SASxport::read.xport(paste0(baseDir, "/", filename))
                return(df)
        }else if ( stringr::str_sub(filename, -4) == ".xml" ){
                df <- R4DSXML::read.dataset.xml( paste0(baseDir, "/", filename), paste0(baseDir, "/", getDefineXml(baseDir)))
                return(df)
        }
}
