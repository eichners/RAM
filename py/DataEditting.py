#%%
import pandas as pd
import geopandas as gpd
import os
#%%

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

which_one = 'Completed'
path = r"C:\Users\csucuogl\Documents\GitHub\RAM\data\{}.geojson".format(which_one)
df = gpd.read_file( path )

df['Primary TEC'] = df['Primary TEC'].str.replace( 'HABITAT FOR WATERBIRDS' , "STECIslands")
df['Primary TEC'] = df['Primary TEC'].str.replace( 'COASTAL WETLANDS' , "STECWetland")
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

print( df['Primary TEC'].unique() )

df.to_file( path , driver = "GeoJSON" , encoding ='utf-8')

#%%

df.dropna( axis=1 , how='all')
df.head()

# %%

df.to_file(  os.path.join(folder , "Completed.geojson") , encoding ='utf-8',driver="GeoJSON")

# %%

pd.set_option('display.max_columns', None)
which_one = "Retired"
path = r"C:\Users\csucuogl\Documents\GitHub\RAM\data\{}.geojson".format(which_one)
working = gpd.read_file( path )
working.head()



#%%

for i in working.columns[ working.columns.str.contains("STEC") ]:
    print(i)
    print( working[i].unique() )

#%%

working['STECCoastWet'] = working['STECCoastWet'].replace('False',False)
working['STECCoastWet'] = working['STECCoastWet'].replace('True',True)
working['STECCoastWet'] = working['STECCoastWet'].replace('TRUE This is FWW so should be FALSE',False)
working['STECCoastWet'] = working['STECCoastWet'].replace('TRUE ',True)

working['STECCoastWet'].unique()


# %%

working['db'] = which_one
# %%

working.columns[ working.columns.str.contains("STEC") ]

#working['STECWetland'] = (working['STECCoastWet'] | working['STECFreshWet']) 
#working.loc[ (working['STECFreshWet'] == True) & (working['STECCoastWet'] == True)  , 'STECWetland' ] = True


working['STECWetland'] = (working['STECCoastWet'] | working['STECFreshWet']) 

working.loc[ (working['STECFreshWet'] == True) & (working['STECCoastWet'] == True)  , 'STECWetland' ] = True

working[ ['STECWetland','STECCoastWet','STECFreshWet'] ].head(20)

#%%

working = working.drop( ['STECCoastWet','STECFreshWet'] , axis =1 )
working.head()

#%%

working.to_file( path , driver = "GeoJSON" , encoding ='utf-8')
# %%

# %%

working.columns[ working.columns.str.contains("STEC") ]

# %%
