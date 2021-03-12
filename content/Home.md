import { HomeImages } from 'src/components/Home/HomeImages'
import { Link } from 'src/components/Link/Link'
import { LinkExternal } from 'src/components/Link/LinkExternal'


Click on a variant button to start exploring!

CoVariants provides an overview of SARS-CoV-2 variants and mutations that are of interest. Here, you can find out what mutations define a variant, what impact they might have (with links to papers and resources), where variants are found, and see the variants in Nextstrain builds!

Click one of the colored buttons to look at a particular [Variant](/variants) - to read information, see graphs and the protein structure, and link out to focused Nextstrain builds.
To look at many variants at once, check out the [Per Variant](/per-variant) and [Per Country](/per-country) pages, where you can view a lot of data in the same place, and compare variants and countries!

<HomeImages/>

**What do the names mean?** 
CoVariants uses the Nextstrain naming system for variants ([read more here](https://nextstrain.org/blog/2021-01-06-updated-SARS-CoV-2-clade-naming/)). However, the fact that there's multiple naming systems is confusing! See the table below to help find the variant you're interested in.

<div align="center">

| Nextstrain Clade      |&#124; Pango Lineage | &#124;Other Name(s) |
| ----------- | ----------- |--------|
| <Var name="20E (EU1)" prefix=""/>     | &#124; <Lin name="B.1.177"/> | &#124; 20A.EU1 |
| <Var name="20A.EU2" prefix=""/>       | &#124; <Lin name="B.1.160"/>           | &#124;  |
| <Var name="20I/501Y.V1" prefix=""/>   | &#124; <Lin name="B.1.1.7" report />   | &#124; VOC 202012/01 |
| <Var name="20H/501Y.V2" prefix=""/>   | &#124; <Lin name="B.1.351" report />   | &#124; 501Y.V2 |
| <Var name="20J/501Y.V3" prefix=""/>   | &#124; <Lin name="P.1" report />       | &#124; |
| <Var name="20C/S:452R" prefix=""/>    | &#124; <Lin name="B.1.427" />/<Lin name="B.1.429" />  | &#124; CAL.20C |
| <Var name="20A/S:439K" prefix=""/>    | &#124; <Lin name="B.1.258"         />  | &#124; |
| <Var name="20A/S:98F" prefix=""/>     | &#124; <Lin name="B.1.221"         />  | &#124; |
| <Var name="20C/S:80Y" prefix=""/>     | &#124; <Lin name="B.1.367"         />  | &#124; |
| <Var name="20B/S:626S" prefix=""/>    | &#124; <Lin name="B.1.1.277"       />  | &#124; |
| <Var name="20B/S:1122L" prefix=""/>   | &#124; <Lin name="B.1.1.302"       />  | &#124; |
| <Var name="20A/S:484K" prefix=""/>    | &#124; <Lin name="B.1.525" report />   | &#124; |
| <Var name="20C/S:484K" prefix=""/>    | &#124; <Lin name="B.1.526" />          | &#124; |


</div>

<br/> 

<!-- The variants featured are currently slightly biased towards circulation in Europe: this is simply a reflection that the primary maintainer (Emma Hodcroft) works mostly with European data. We hope to add more variants from other regions soon! -->

This project is free and open source. The content, derived data, code used to generate the data, and code that implements this web application can be found on GitHub: [github.com/hodcroftlab/covariants](https://github.com/hodcroftlab/covariants/).

> **The SARS-CoV-2 pandemic & research surrounding it is ongoing.** Every effort is made to try to keep this repository up-to-date, but readers should take care to double-check that the information is the latest available.

## What's next?

- Browse [Variants](/variants)
- Explore [Per-country distribution](/per-country)
- Explore [Per-variant distribution](/per-variant)
- View [Shared mutations](/shared-mutations)
- See [Frequently asked questions](/faq)
