# Douhau Data Studio
Douhau Data Studio is a data browser desktop application for [CDISC SDTM](https://www.cdisc.org/standards/foundational/sdtm), and support both [SAS XPORT v5](http://support.sas.com/techsup/technote/ts140.pdf) and [CDSIC Dataset-XML](https://www.cdisc.org/standards/data-exchange/dataset-xml) file format.  
Douhau Data Studio has the data grid without pagination that provides non-interrupt and comfortable usability for your clinical data browsing.

# Features
* Browse CDISC SDTM datasets both [SAS XPORT v5](http://support.sas.com/techsup/technote/ts140.pdf) and [Dataset-XML](https://www.cdisc.org/standards/data-exchange/dataset-xml) format support
* Browse metadata extract from define.xml
* Dash board for grasping study outline


# Support OS
Douhau Data Studio is build with [Electron](https://www.electronjs.org) and macOS X Big Sur and Windows 10.


# Related Links
* [Douhau Data Studio Website](https://i-akiya.github.io/DouhauDataStudio-Website/)
* [User's Guide](https://i-akiya.github.io/DouhauDataStudio-Website/)
* [Community](https://gitter.im/douhau-data-studio/community)

## Prerequirments
Douhau Data Studio is composed with R Shiny, so it is necessary to set up R and R packages bellow into your desktop machine before Douhau Data Studio install.  
* [R](https://cran.r-project.org)
* [shiny](https://shiny.rstudio.com)
* [shinydashboard](https://rstudio.github.io/shinydashboard/)
* [dplyr](https://dplyr.tidyverse.org)
* [stringr](https://stringr.tidyverse.org)
* [SASxport](https://cran.r-project.org/web/packages/SASxport/index.html)
* [R4DSXML](https://github.com/i-akiya/R4DSXML)
* [R.utils](https://cran.r-project.org/web/packages/R.utils/index.html)
* [yaml](https://cran.r-project.org/web/packages/yaml/index.html)
* [DT](https://github.com/rstudio/DT)

### License
MIT License  

## Limitations
Currently release ver. 0.1.0 is not enough software testing, we don't recommend to use your production purpose.

### Contribution
Please don't hesitate to report bugs and feature requests. You can post anything to [github issues](https://github.com/i-akiya/DouhauDataStudio/issues) and to [gitter space](https://gitter.im/douhau-data-studio/community).
