import matplotlib.patches as mpatches
import pandas as pd
import datetime
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from shutil import copyfile
from collections import defaultdict
from matplotlib.patches import Rectangle
import matplotlib.patches as mpatches
import copy
from colors_and_countries import *
from travel_data import *
from clusters import *
from helpers import *

figure_path = "../cluster_scripts/figures/"

grey_color = "#cccccc"
fmt = "pdf"

#clusters = {"S477": {'snps': [22991, 4542], 'cluster_data': [],
#            'country_info':[], 'col': "#ff8d3d"},
#            "S222": {'snps': [22226, 28931, 29644], 'cluster_data': [],
#            "country_info":[], 'col': "#65beeb"},
#            "S98": {'snps': [21854, 25504], 'cluster_data': [],
#            "country_info":[], 'col': "#911eb4"},
#            "S80": {'snps': [21799, 3098], 'cluster_data': [],
#            "country_info":[], 'col': "#3cb44b"}
#            }

# Get diagnostics file - used to get list of SNPs of all sequences, to pick out seqs that have right SNPS
diag_file = "results/sequence-diagnostics.tsv"
diag = pd.read_csv(diag_file, sep='\t', index_col=False)
# Read metadata file
input_meta = "data/metadata.tsv"
meta = pd.read_csv(input_meta, sep='\t', index_col=False)

for clus in clusters.keys():

    print(f"Running cluster {clus}")
    snps = clusters[clus]['snps']

    # get the sequences that we want - which are 'part of the cluster:
    wanted_seqs = []

    for index, row in diag.iterrows():
        strain = row['strain']
        snplist = row['all_snps']
        if not pd.isna(snplist):
            intsnp = [int(x) for x in snplist.split(',')]
            if all(x in intsnp for x in snps):
                #if meta.loc[meta['strain'] == strain].region.values[0] == "Europe":
                wanted_seqs.append(row['strain'])

    # There's one spanish seq with date of 7 March - we think this is wrong.
    # If seq there and date bad - exclude!
    bad_seq = meta[meta['strain'].isin(['Spain/VC-IBV-98006466/2020'])]
    if bad_seq.date.values[0] == "2020-03-07" and 'Spain/VC-IBV-98006466/2020' in wanted_seqs:
        wanted_seqs.remove('Spain/VC-IBV-98006466/2020')

    print(len(wanted_seqs)) # how many are there?

    cluster_meta = meta[meta['strain'].isin(wanted_seqs)]
    observed_countries = [x for x in cluster_meta['country'].unique()]

    # What countries do sequences in the cluster come from?
    print(f"The cluster is found in: {observed_countries}")


    # Let's get some summary stats on number of sequences, first, and last, for each country.
    country_info = pd.DataFrame(index=all_countries, columns=['first_seq', 'num_seqs', 'last_seq', "sept_aug_freq"])
    country_dates = {}
    cutoffDate = datetime.datetime.strptime("2020-08-01", '%Y-%m-%d')

    for coun in all_countries:
        if coun in uk_countries:
            temp_meta = cluster_meta[cluster_meta['division'].isin([coun])]
        else:
            temp_meta = cluster_meta[cluster_meta['country'].isin([coun])]
        country_info.loc[coun].first_seq = temp_meta['date'].min()
        country_info.loc[coun].last_seq = temp_meta['date'].max()
        country_info.loc[coun].num_seqs = len(temp_meta)

        country_dates[coun] = [datetime.datetime.strptime(dat, '%Y-%m-%d') for dat in temp_meta['date']]

        herbst_dates = [x for x in country_dates[coun] if x >= cutoffDate]
        if coun in uk_countries:
            temp_meta = meta[meta['division'].isin([coun])]
        else:
            temp_meta = meta[meta['country'].isin([coun])]
        all_dates = [datetime.datetime.strptime(x, '%Y-%m-%d') for x in temp_meta["date"] if len(x) == 10 and "-XX" not in x and datetime.datetime.strptime(x, '%Y-%m-%d') >= cutoffDate]
        country_info.loc[coun].sept_aug_freq = round(len(herbst_dates)/len(all_dates),2)

    print(f"\nCluster {clus}")
    print(country_info)
    print("\n\n")
    clusters[clus]['country_info'] = copy.deepcopy(country_info)

    # Get counts per week for sequences in the cluster
    clus_week_counts = {}
    for coun in all_countries:
        counts_by_week = defaultdict(int)
        for dat in country_dates[coun]:
            #counts_by_week[dat.timetuple().tm_yday//7]+=1 # old method
            counts_by_week[(dat.isocalendar()[1]//2*2)]+=1  #returns ISO calendar week
        clus_week_counts[coun] = counts_by_week

    # Get counts per week for sequences regardless of whether in the cluster or not - from week 20 only.
    total_week_counts = {}
    for coun in all_countries:
        counts_by_week = defaultdict(int)
        if coun in uk_countries:
            temp_meta = meta[meta['division'].isin([coun])]
        else:
            temp_meta = meta[meta['country'].isin([coun])]
        #week 20
        for ri, row in temp_meta.iterrows():
            dat = row.date
            if len(dat) == 10 and "-XX" not in dat: # only take those that have real dates
                dt = datetime.datetime.strptime(dat, '%Y-%m-%d')
                #exclude sequences with identical dates & underdiverged
                if coun == "Ireland" and dat == "2020-09-22":
                    continue
                # wk = dt.timetuple().tm_yday//7  # old method
                wk = dt.isocalendar()[1]//2*2 #returns ISO calendar week
                if wk >= 20:
                    counts_by_week[wk]+=1
        total_week_counts[coun] = counts_by_week

    # Convert into dataframe
    cluster_data = pd.DataFrame(data=clus_week_counts)
    total_data = pd.DataFrame(data=total_week_counts)

    # sort
    total_data=total_data.sort_index()
    cluster_data=cluster_data.sort_index()

    clusters[clus]['cluster_data'] = copy.deepcopy(cluster_data)

print("\n\nYou can check on the country_info with: clusters['S477']['country_info'] ")

for clus in clusters.keys():
    c_i = clusters[clus]['country_info']
    c_i[c_i['num_seqs'] > 10]
    print(f"Countries with >10 seqs in cluster {clus}:")
    print("\t", ", ".join(c_i[c_i['num_seqs'] > 10].index))
    print("\n")

#fix cluster order in a list so it's reliable
clus_keys = [x for x in clusters.keys()]

my_df = [clusters[x]["country_info"] for x in clus_keys]
all_num_seqs = pd.concat([x.loc[:,"num_seqs"] for x in my_df],axis=1)
all_num_seqs.columns = clus_keys

has10 = []
has10_countries = []
for index, row in all_num_seqs.iterrows():
    if any(row > 10) and index not in uk_countries:
        has10.append("*")
        has10_countries.append(index)
    else:
        has10.append("")

all_num_seqs["has_10"] = has10

print("Countries who have more than 10 in any cluster:", has10_countries, "\n")
print(all_num_seqs)

#cluster_data_S477 = copy.deepcopy(cluster_data)
#cluster_data_S222 = copy.deepcopy(cluster_data)

############## Plot

#Use the S477 data to decide what to plot.
countries_to_plot = ["France", "United Kingdom", "Netherlands",
    "Switzerland", "Belgium", "Spain", "Norway", "Ireland", "Denmark", "Czech Republic"]
#Remember to adjust the number of axes if needed below....


country_week = {clus: {} for clus in clusters}

#fig, ax1 = plt.subplots(nrows=1,figsize=(10,7))
fs = 14
#fig, (ax1, ax2, ax3, ax4, ax5, ax6, ax7) = plt.subplots(nrows=7, sharex=True,figsize=(9,9),
#                                    gridspec_kw={'height_ratios':[1,1,1,1,1,1,1]})
fig, axs = plt.subplots(nrows=len(countries_to_plot)+1, sharex=True,figsize=(9,11))

week_as_dates = {}

#for coun in [x for x in countries_to_plot]:
for coun, ax in zip(countries_to_plot, axs[1:]):
    i=0
    first_clus_count = []
    ptchs = []
    #for cluster_data in [cluster_data_S477, cluster_data_S222]:
    for clus in clusters.keys():
        cluster_data = clusters[clus]['cluster_data']
        week_as_date, cluster_count, total_count = non_zero_counts(cluster_data, total_data, coun)

        week_as_dates[coun] = week_as_date
        #clusters[clus]['week_as_date'] = week_as_date
        #clusters[clus]['cluster_count'] = cluster_count
        #clusters[clus]['total_count'] = total_count

        country_week[clus][coun] = cluster_count/total_count

        linesty = '-'
        lab = clusters[clus]["display_name"] #f"{clus}"
        if i == 0:
            first_clus_count = [0] * len(cluster_count)
        #if i == 1:
        #    linesty = ':'
        cluster_count = first_clus_count + cluster_count #unindented

  #      ax.plot(week_as_date, cluster_count/total_count,
  #              color=clusters[clus]['col'],#country_styles[coun]['c'],
  #              linestyle=linesty)#, label=lab)
        
        #ax.scatter(week_as_date, cluster_count/total_count, s=[marker_size(n) for n in total_count],
        #        color=country_styles[coun]['c'],
        #        linestyle=linesty)
        #if i==0:
        #    ax.fill_between(week_as_date, 0, cluster_count/total_count, facecolor=clusters[clus]['col'])
        #    patch = mpatches.Patch(color=clusters[clus]['col'], label=lab)
        #    ptchs.append(patch)
        #else:
        ax.fill_between(week_as_date, first_clus_count/total_count, cluster_count/total_count, facecolor=clusters[clus]['col'])
        patch = mpatches.Patch(color=clusters[clus]['col'], label=lab)

        #exclude 501 for now (not present)
        if clus != "S501":
            ptchs.append(patch)
        if i == len(clusters)-1 :
            ax.fill_between(week_as_date, cluster_count/total_count, 1, facecolor=grey_color)
            patch = mpatches.Patch(color=grey_color, label=f"other")
            ptchs.append(patch)
        #if i == 0:
        first_clus_count = cluster_count # unindented
        i+=1
    ax.text(datetime.datetime(2020,6,1), 0.7, coun, fontsize=fs)
    ax.tick_params(labelsize=fs*0.8)
    #ax.set_ylabel('frequency')
    #ax.legend(ncol=1, fontsize=fs*0.8, loc=2)

axs[0].legend(handles=ptchs, loc=3, fontsize=fs*0.7, ncol=4)
axs[0].axis('off')
fig.autofmt_xdate(rotation=30)
plt.show()
plt.tight_layout()

plt.savefig(figure_path+f"EUClusters_compare.{fmt}")
trends_path = figure_path+f"EUClusters_compare.{fmt}"
copypath = trends_path.replace("compare", "compare-{}".format(datetime.date.today().strftime("%Y-%m-%d")))
copyfile(trends_path, copypath)


#for clus in clusters.keys():
#    for coun in countries_to_plot:
#        print(clus, coun, len(country_week[clus][coun]))
