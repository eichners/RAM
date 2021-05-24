#%% IMPORT LIBS

import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt


# %% GEOMETRY FROM OLD MAP
# OLd POLYGONS
old_map_path = r"C:\Users\csucuogl\Desktop\RAM_Sites\CRPGeodata.gdb"
old_map_poly = gpd.read_file(old_map_path, driver="FileGDB", layer='CRPPolygons')
old_map_poly['CRPID'] = old_map_poly['CRPID'].astype(int)
old_map_poly = old_map_poly.to_crs( 4326 )
old_map_poly.head()

#OLD POINTS
old_map_point = gpd.read_file(old_map_path, driver="FileGDB", layer='CRPPoints')
old_map_point['CRPID'] = old_map_point['CRPID'].astype(int)
old_map_point = old_map_point.to_crs( 4326 )
old_map_point.head()

#NEW POLYGONS
new_poly = gpd.read_file( r"C:\Users\csucuogl\Desktop\RAM_Sites\PolygonstoReplacePoints\PolygonstoReplacePoints.shp" )
new_poly['CRPID'] = new_poly['CRP_ID'].astype(int)
new_poly = new_poly.to_crs( 4326 )
new_poly.head()


#%% ------------------------------------------------  WORKING SITES TAB
#--------------------- Import Working Sites

working_sites = pd.read_excel( r"C:\Users\csucuogl\Desktop\RAM_Sites\CRP_Review_all.xlsx" , sheet_name='Working Sites')
working_sites.head()

#%%
#working_sites['Spatial Data'].unique().tolist() 
working_sites.groupby( by='Spatial Data').size()

#%% -----------------------  MATCH HRE FILES
#HRE Sites

hre_poly = gpd.read_file( r"C:\Users\csucuogl\Desktop\RAM_Sites\HREMerge\HRE_Filled_Flat.shp" )
hre_poly = hre_poly.to_crs(epsg=4326)
#Filter HRE sites
working_sites['Spatial Data'] = working_sites['Spatial Data'].astype(str)
hres = working_sites[ working_sites['Spatial Data'].str.contains('HRE') ]
#Join Geometry. This geometry is editted from the original file
new_hres = hres.join( hre_poly[['CRP_ID','geometry']].set_index("CRP_ID"), on="CRPID" )
new_hres = new_hres.dropna(how='all',axis=1)

new_hres.head()


# %% APPEND GEOMERTY BASED on Spatial Data COLUMN
# WS df's are portions of the working site

#------------------ Per Old Map
ws_old_data = working_sites[ working_sites['Spatial Data'] == 'Per old map ' ]
ws_old_data = ws_old_data.join( old_map_poly[['CRPID','geometry']].set_index("CRPID") , on='CRPID' )
ws_old_data

# %%
#---------------------- True (From New Data)
ws_new_data = working_sites[ working_sites['Spatial Data'] == 'True' ]
ws_new_data = ws_new_data.join( new_poly[['CRPID','geometry']].set_index('CRPID') , on = 'CRPID' )
ws_new_data

# %% -------------------- Use polygon for site 133

ws_133 = working_sites[ working_sites['Spatial Data'] == 'Use polygon for site 133' ].copy()
ws_133['geometry'] = old_map_poly[ old_map_poly['CRPID'] == 133 ]['geometry'].tolist()[0]
ws_133

#%% -------------------- Use polygon for site 174

ws_174 = working_sites[ working_sites['Spatial Data'] == 'Use polygon for site 174' ].copy()
ws_174['geometry'] = old_map_poly[ old_map_poly['CRPID'] == 174 ]['geometry'].tolist()[0]
ws_174

#%% ----------------------- MERGE ALL TOGETHER

datasets = [ws_old_data,ws_new_data,ws_133,ws_174,new_hres] #Add new datasets here!!!

df = pd.DataFrame()
for _ in datasets:
    df = df.append( _ )

gdf_working = gpd.GeoDataFrame( data = df , geometry='geometry' , crs = 4326 )
gdf_working.plot()

#%%

retired_sites = pd.read_excel( r"C:\Users\csucuogl\Desktop\RAM_Sites\CRP_Review_all.xlsx" , sheet_name='Retired-Complete')
retired_sites = retired_sites[ retired_sites.columns[~retired_sites.columns.str.contains("Unnamed|Polygon")] ]

retired_sites = retired_sites.join( old_map_poly[['CRPID','geometry']].set_index("CRPID") , on = "CRPID" )

gdf_retired = gpd.GeoDataFrame( data = retired_sites , geometry='geometry' , crs = 4236 )
gdf_retired.plot()

# %% ------------------------------------------------- COMPLETED - POINTS
comp_sites = pd.read_excel( r"C:\Users\csucuogl\Desktop\RAM_Sites\Completed_Sites_working.xlsx" , sheet_name='Compiled')

#There are typos
comp_sites['Long'] = comp_sites['Long'].replace(',','')
comp_sites['Long'] = comp_sites['Long'].astype(float)

comp_sites['Lat'] = comp_sites['Lat'].astype(str)
comp_sites['Lat'] = comp_sites['Lat'].str.replace(',','')
comp_sites['Lat'] = comp_sites['Lat'].astype(float)

#There are wrong enteries
comp_sites['Long'] = [r if r<0 else r*-1 for i,r in comp_sites['Long'].iteritems()]

gdf_comp = gpd.GeoDataFrame( data = comp_sites , 
    geometry = gpd.points_from_xy(comp_sites['Long'],comp_sites['Lat']) , 
    crs = 4326 )

gdf_comp.plot()

# %% -------------------------------------          EXPORT ALL OUT to csv if you have to---------------------------
import os
folder = r'C:\Users\csucuogl\Desktop\RAM_Sites\Processed_Data'

gdf_working.to_csv( os.path.join(folder , "WorkingSites.csv")  )
gdf_comp.to_csv( os.path.join(folder , "CompletedSitesWorking.csv") )
gdf_retired.to_csv( os.path.join(folder , "RetiredCompleteSites.csv")  )

# %% -------------------------------------- A SIMPLE SINGLE DATABASE -> A Geojson
#One database to rule them all. 

gdf_working['db'] = 'working sites'
gdf_retired['db'] = 'retired'

ram_poly = gdf_working.append( gdf_retired )
ram_poly = ram_poly.dropna(how='all',axis = 1 )

ram_poly.head()
# %%
pd.set_option('display.max_rows', None)
ram_poly = ram_poly.astype({col: 'int32' for col in ram_poly.select_dtypes('int64').columns})
ram_poly = ram_poly.astype({col: 'float32' for col in ram_poly.select_dtypes('float64').columns})
ram_poly = ram_poly.astype({col: 'string' for col in ram_poly.select_dtypes('object').columns})

ram_poly.dtypes
# %% Export Polygons & Points

folder = r'C:\Users\csucuogl\Documents\GitHub\RAM\data'
ram_poly.to_file( os.path.join(folder , "PolySites.geojson") , driver = 'GeoJSON' , encoding='utf-8' )

gdf_comp['db'] = 'retired'
gdf_comp.to_file( os.path.join(folder , "PointSites.geojson") , driver = 'GeoJSON' , encoding='utf-8' )

# %%
