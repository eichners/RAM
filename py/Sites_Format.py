#%% Format Completed Sites

import pandas as pd
pd.set_option("display.max_columns",None)

df = pd.read_excel(r"C:\Users\csucuogl\Downloads\Completed_Sites_working_r2.xlsx", sheet_name='Compiled')
df.head()
# %%

df = df[ df.columns[ ~ df.columns.str.contains('Unnamed') ] ]
df.head()
# %%

cols = 'Name	Year Completed	Acres	State	Municipality or Borough	Key Funding Source	Contact	Primary TEC	Narrative	Cost	Key Partners	Datafrom	RWG Comments'.split("\t")

for c in cols:
    df[c] = df[c].fillna("No Information")

df
# %%
df['Photo'] = False
df['Photo_Credit'] = None
df["CRPID"] = df['CRPProjID']
df = df.drop('CRPProjID',axis=1)
df['db'] = 'Completed'

df.head()
# %%

df['SiteName'] = df['Name']
df = df.drop('Name',axis=1)

#%%

import geopandas as gpd

gdf = gpd.GeoDataFrame(df,geometry=gpd.points_from_xy(
    df['Long'],df['Lat']
), crs=4326 )

gdf.plot()
# %%

gdf.to_file( r"C:\Users\csucuogl\Documents\GitHub\RAM\data\Completed_R2.geojson",
    driver="GeoJSON", encoding = 'utf-8' )
# %% Format Working Sites

path = r"C:\Users\csucuogl\Documents\GitHub\RAM\data\Working.geojson"
gdf = gpd.read_file( path )

gdf.head()

# %% Fill NA

cols = ['SiteLabel','PlanRegion','Acreage','Ownership','ProtectionCat','AcquisitionCat','RestorationCat',
    'DevelopmentCat','UseDescrip','History','KnownContaminates','Contact']

for c in cols:
    gdf[c] = gdf[c].fillna("No Information")

gdf

# %%

gdf['Photo'] = False
gdf['Photo_Credit'] = None


# %%

gdf.to_file( r"C:\Users\csucuogl\Documents\GitHub\RAM\data\Working_R2.geojson",
    driver="GeoJSON", encoding = 'utf-8' )


# %%
