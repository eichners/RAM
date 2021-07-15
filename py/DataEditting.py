#%%
import pandas as pd
import geopandas as gpd
import os

folder = r'C:\Users\csucuogl\Documents\GitHub\RAM\data'


df = gpd.read_file( os.path.join(folder , "PolySites.geojson") )

df.head()
# %%

df['db'].unique()
# %%

dfw = df[ df['db']== 'working sites'].copy()
dfr = df[ df['db']== 'retired'].copy()
# %%

dfw.to_file(  os.path.join(folder , "Working.geojson") , encoding ='utf-8',driver="GeoJSON")
dfr.to_file(  os.path.join(folder , "Retired.geojson") , encoding ='utf-8',driver="GeoJSON")

# %%

folder = r'C:\Users\csucuogl\Documents\GitHub\RAM\data'
df = gpd.read_file( os.path.join(folder , "PointSites.geojson") )

df.head()

# %%

df.columns = df.columns.str.replace( "Name",'SiteName')
df.head()
# %%

df['CRPID'] = [i+1000 for i in range(len(df)) ]
df.head()

#%%

df['db'] = 'Completed Sites'
df.head()

#%%

df['Primary TEC'] = df['Primary TEC'].str.upper()
df['Primary TEC'].unique()

#%%

df['Primary TEC'] = df['Primary TEC'].str.replace( 'HABITAT FOR WATERBIRDS' , "STECIslands")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'COASTAL WETLANDS' , "STECCoastWet")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'TRIBUTARY CONNECTIONS' , "STECTributary")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'COASTAL AND MARITIME FORESTS' , "STECForests")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'OYSTER REEFS' , "STECOyster")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'EELGRASS BEDS' , "STECEelgrass")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'SHORELINES AND SHALLOWS' , "STECShore")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'ENCLOSED AND CONFINED WATERS' , "STECWater")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'PUBLIC ACCESS' , "STECAccess")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'ACQUISITION' , "STECAcquisition")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'FISH, CRABS AND LOBSTERS' , "STECAquaticHab")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'SEDIMENT COMINATION' , "STECSediment")


df['Primary TEC'].unique()


# %%

df.to_file(  os.path.join(folder , "Completed.geojson") , encoding ='utf-8',driver="GeoJSON")

# %%



# %%
