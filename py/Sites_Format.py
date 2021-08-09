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

import geopandas as gpd
import pandas as pd
pd.set_option("display.max_columns",None)


df = gpd.read_file( r"C:\Users\csucuogl\Documents\GitHub\RAM\data\Working_R2.geojson" )

df.head()
# %%

#PlanRegion



#%%


points = gpd.read_file( r"C:\Users\csucuogl\Documents\GitHub\RAM\data\Completed_R2.geojson" )
points.head()
# %%

tecs = [
		{value:"STECAccess",name:"Public Access" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECAccess.svg" ,desc:"Improve direct access to the water and create linkages to other recreational areas, as well as provide increased opportunities for fishing, boating, swimming, hiking, education, or passive recreation."},
		{value:"STECAcquisition",name:"Acquisition", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECAcquisition.svg" ,desc:"Protect ecologically valuable coastal lands throughout the Hudson-Raritan Estuary from future development through land acquisition."},
		{value:"STECEelgrass",name:"Eelgrass Beds" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECEelgrass.svg" ,desc:"Establish eelgrass beds at several locations in the HRE study area."},
		{value:"STECForests",name:"Coastal and Maritime Forests", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECForests.svg" ,desc:"Create a linkage of forests accessible to avian migrants and dependent plant communities."},
		{value:"STECAquaticHab",name:"Habitat for Fish, Crab, and Lobsters" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECAquaticHab.svg" ,desc:"Create functionally related habitats in each of the eight regions of the Hudson-Raritan Estuary."},
		{value:"STECIslands",name:"Habitats for Waterbirds", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECIslands.svg" ,desc:"Restore and protect roosting, nesting, and foraging habitat (i.e., inland trees, wetlands, shallow shorlines) for long-legged wading birds."},
		{value:"STECOyster",name:"Oyster Reefs" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECOyster.svg" ,desc:"Establish sustainable oyster reefs at several locations."},
		{value:"STECSediment",name:"Sediment Contamination", source: "https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECSediments.svg" ,desc:"Isolate or remove one or more sediment zone(s) that is contaminated until such time as all HRE sediments are considered uncontaminated based on all related water quality standards, related fishing / shelling bans or fish consumption advisories, and any newly-promulgated sediment quality standards, criteria or protocols"},
		{value:"STECShore",name:"Shorelines and Shallows" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECShore.svg" ,desc:"Create or restore shorline and shallow sites with a vegetated riparian zone, an inter-tidal zone with a stable slope, and illuminated shallow water."},
		{value:"STECTributary",name:"Tributary Connections" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECTributary.svg" ,desc:"Reconnect and restore freshwater streams to the estuary to provide a range of quality habitats to aquatic organisms."},
		{value:"STECWater",name:"Enclosed and Confined Water" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECWater.svg" ,desc:"Improve water quality in all enclosed waterways and tidal creeks within the estuary to match or surpass the quality of their receiving waters."},
		{value:"STECWetland",name:"Wetlands" , source:"https://raw.githubusercontent.com/PrattSAVI/RAM/main/img/iconsSv/STECWetland.svg" ,desc:"Create and restore coastal and freshwater wetlands at a rate exceeding the annual loss or degradation, to produce a net gain in acreage."},
	]

points['Primary TEC'].unique()
# %%


points['Primary TEC'] = points['Primary TEC'].str.replace('COASTAL WETLANDS' , "Wetlands" )
points['Primary TEC'] = points['Primary TEC'].str.replace('TRIBUTARY CONNECTIONS' , "Tributary Connections" )
points['Primary TEC'] = points['Primary TEC'].str.replace('COASTAL AND MARITIME FORESTS' , "Coastal and Maritime Forests" )
points['Primary TEC'] = points['Primary TEC'].str.replace( 'OYSTER REEFS' , "Oyster Reefs" )
points['Primary TEC'] = points['Primary TEC'].str.replace(  'ENCLOSED AND CONFINED WATERS' , "Enclosed and Confined Water" )
points['Primary TEC'] = points['Primary TEC'].str.replace(  'EELGRASS BEDS' , "Eelgrass Beds" )


points['Primary TEC'].unique()
# %%

points.to_file( r"C:\Users\csucuogl\Documents\GitHub\RAM\data\Completed_R2.geojson",
    driver="GeoJSON", encoding = 'utf-8' )

# %%

df['PlanRegion'].unique()
# %%

df1 = df[ df['Link to']=='ACE Sheet' ]

df1
# %%
