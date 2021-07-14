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

# %%

df.to_file(  os.path.join(folder , "Completed.geojson") , encoding ='utf-8',driver="GeoJSON")

# %%
