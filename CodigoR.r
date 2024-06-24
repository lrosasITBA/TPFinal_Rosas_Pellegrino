#Instalación de Librerias
install.packages("ggplot")
install.packages("tidyverse")
install.packages("sf")
install.packages("cartogram")
install.packages("dplyr")
install.packages("geodata")
install.packages("gapminder")
install.packages("plotly"
#Activación de Librerias
library(ggplot2)
library(tidyverse)
library(sf)
library(cartogram)
library(dplyr)
library(geodata)
library(gapminder)
library(plotly)
#Barrios de CABA
mapa <- read_sf("https://cdn.buenosaires.gob.ar/datosabiertos/datasets/barrios/barrios.geojson")
head(barrios)
#CSV modificado. Se sumo la cantidad de listings por barrio. Ver descricion de archivo completa
listingsxbarrios = read.csv("https://raw.githubusercontent.com/lrosasITBA/TPFinal_Rosas_Pellegrino/main/listingsbarrios.csv",sep=";")
head(listingsxbarrios)
#Use left_join para unificar la tabla de barrios, con la suma de los listings por barrio
mapa <- mapa %>% left_join(listingsxbarrios,by = c("BARRIO" = "barrio"))
#Primer cartograma. Devuele la Cantidad de Listings por barrio de CABA, con labels de barrio.
cart1 = ggplot() +
     geom_sf(data = mapa, aes(fill = suma), size = 0.2) + 
     labs(title = "Cantidad de Listings por Barrio de CABA", 
     fill = "listings",
     x = "Longitud",
     y = "Latitud") + 
     scale_fill_viridis_c(trans = "log2", na.value = "grey80") + 
     geom_sf_label(data = mapa, aes(label = BARRIO), size = 2, alpha = 0.7)+
     theme_minimal() +
     theme(legend.direction = "horizontal", 
           legend.position = "bottom", 
           legend.title=element_text(size=8), 
           legend.key.width = unit(2,"cm"))
x11();cart1
#Segundo cartograma. Barrios con tamaño distorcionado según Cantidad de Listings. Sin Labels
mapa_merc <- st_transform(mapa, 3857)
mapa_cartogram <- st_transform(mapa_cartogram, st_crs(mapa))
x11();cart2 = plot(st_geometry(mapa_cartogram))
cart2 = plot(st_geometry(mapa_cartogram))
#Tercer cartograma. Barrios con tamaño distorcionado según Cantidad de Listings. Sin labels de barrio.
cart3 = ggplot(mapa_cartogram)+
      geom_sf(data=mapa_cartogram, aes(fill = suma), linewidth = 0, alpha = 0.9) +
      labs(title = "Cantidad de Listings por Barrio de CABA", 
           fill = "listings",
 	x = "Longitud",
     y = "Latitud") + 
      scale_fill_viridis_c(trans = "log2", na.value = "grey80") + 
      theme_minimal() +
      theme(legend.direction = "horizontal", 
            legend.position = "bottom", 
            legend.title=element_text(size=8), 
            legend.key.width = unit(2,"cm"))
x11(); cart3
#Cuarto cartograma. Se hace interactivo el Cartograma2
    cart4 <- gapminder %>%
    ggplot() +
geom_sf(data = mapa, aes(label = BARRIO, fill=suma, size=suma)) + 
     labs(title = "Cantidad de Listings por Barrio de CABA", 
     fill = "listings",
     x = "Longitud",
     y = "Latitud") + 
     scale_fill_viridis_c(trans = "log2", na.value = "grey80") + 
     theme_minimal() +
     theme(legend.direction = "horizontal", 
           legend.position = "bottom", 
           legend.title=element_text(size=8), 
           legend.key.width = unit(2,"cm"))

geom_point()

ggplotly(cart4)
#Quinto cartograma. Se hace interactivo el cartograma3
    cart5 <- gapminder %>%
    ggplot() +
geom_sf(data = mapa_cartogram, aes(label = BARRIO, fill=suma, size=suma), linewidth = 0, alpha = 0.9) + 
     labs(title = "Cantidad de Listings por Barrio de CABA", 
     fill = "listings",
     x = "Longitud",
     y = "Latitud") + 
     scale_fill_viridis_c(trans = "log2", na.value = "grey80") + 
     theme_minimal() +
     theme(legend.direction = "horizontal", 
           legend.position = "bottom", 
           legend.title=element_text(size=8), 
           legend.key.width = unit(2,"cm"))

geom_point()

x11();ggplotly(cart5)

