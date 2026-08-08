/* PROTOTYPE — 36 real, cited, licence-clean cut-outs. NOT the arrival set (that's 05).
   Enough material to judge three visual directions: global coverage, a sparse deep head,
   and enough post-1500 density that crowding actually reads.
   y = absolute year, negative = BCE. disp = the date as the holding institution publishes it. */
window.ITEMS = [
  {k:'ainghazal', y:-7000, disp:"c. 7000 BCE", n:"'Ain Ghazal statue",       src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'MLWatts',                 url:"https://commons.wikimedia.org/wiki/File:%27Ain_Ghazal_statue,_Mus%C3%A9e_Louvre.jpg"},
  {k:'jar',       y:-2975, disp:"3300–2650 BCE", n:"Painted jar",            src:'Cleveland Museum of Art', lic:'CC0', cred:'Cleveland Museum of Art',    url:"https://clevelandart.org/art/2004.64"},
  {k:'jomon',     y:-3000, disp:"c. 3000 BCE", n:"Jōmon flame vessel",       src:'Cleveland Museum of Art', lic:'CC0', cred:'John L. Severance Fund',   url:"https://clevelandart.org/art/1984.68"},
  {k:'cuneiform', y:-2500, disp:"c. 2500 BCE", n:"Cuneiform tablet",         src:'Wikimedia Commons', lic:'public domain', cred:'original author unknown',           url:"https://commons.wikimedia.org/wiki/File:Cuneiform_Akkadian_clay_tablet_1.jpg"},
  {k:'indus',     y:-2000, disp:"c. 2000 BCE", n:"Seal with unicorn",        src:'Cleveland Museum of Art', lic:'CC0', cred:'Cleveland Museum of Art',    url:"https://clevelandart.org/art/1964.104"},
  {k:'nebra',     y:-1600, disp:"c. 1600 BCE", n:"Nebra sky disc",           src:'Wikimedia Commons', lic:'public domain', cred:'Frank Vincentz',         url:"https://commons.wikimedia.org/wiki/File:Nebra_disc_1.jpg"},
  {k:'tutmask',   y:-1323, disp:"c. 1323 BCE", n:"Mask of Tutankhamun",      src:'Wikimedia Commons', lic:'CC BY-SA 2.0', cred:'Mark Fischer',            url:"https://commons.wikimedia.org/wiki/File:King_Tut_Burial_Mask_(23785641449).jpg"},
  {k:'olmec',     y:-900,  disp:"c. 900 BCE",  n:"Olmec colossal head",      src:'Wikimedia Commons', lic:'CC0', cred:'Gary Todd',                        url:"https://commons.wikimedia.org/wiki/File:Olmec_Colossal_Head,_San_Lorenzo,_Veracruz,_1200-600_BC.jpg"},
  {k:'amphora',   y:-540,  disp:"c. 540 BCE",  n:"Neck-amphora",             src:'The Met', lic:'CC0', cred:'The Met',                                    url:"https://www.metmuseum.org/art/collection/search/250551"},

  {k:'terracotta',y:-210,  disp:"c. 210 BCE",  n:"Terracotta Army warriors", src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'TarnishedPath',           url:"https://commons.wikimedia.org/wiki/File:Terracotta_warriors.jpg"},
  {k:'buddha',    y:200,   disp:"c. 200 CE",   n:"Standing Buddha, Gandhara",src:'The Met', lic:'CC0', cred:'Purchase, Lita Annenberg Hazen Charitable Trust', url:"https://www.metmuseum.org/art/collection/search/38474"},
  {k:'moche',     y:500,   disp:"c. 500 CE",   n:"Moche stirrup-spout bottle",src:'The Met', lic:'CC0', cred:'Gift of Henry G. Marquand, 1882',           url:"https://www.metmuseum.org/art/collection/search/307474"},
  {k:'astrolabe', y:1250,  disp:"c. 1250",     n:"Persian astrolabe",        src:'Wikimedia Commons', lic:'CC BY-SA 3.0', cred:'Jacopo188',              url:"https://commons.wikimedia.org/wiki/File:Persian_astrolabe.jpg"},

  {k:'ming',      y:1450,  disp:"c. 1450",     n:"Jar with dragon",          src:'The Met', lic:'CC0', cred:'Gift of Robert E. Tod, 1937',                url:"https://www.metmuseum.org/art/collection/search/39666"},
  {k:'benin',     y:1550,  disp:"c. 1550",     n:"Benin brass plaque",       src:'The Met', lic:'CC0', cred:'The Michael C. Rockefeller Memorial Collection', url:"https://www.metmuseum.org/art/collection/search/310752"},
  {k:'telescope', y:1609,  disp:"1609",        n:"Galileo's telescope",      src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'Zde',                     url:"https://commons.wikimedia.org/wiki/File:Galilei%27s_older_telescope,_eyepiece_part,_Museo_Galileo,_Florence,_Inv._2428,_224093.jpg"},
  {k:'armor',     y:1683,  disp:"c. 1683",     n:"Harquebusier’s armour",    src:'The Met', lic:'CC0', cred:'The Met',                                    url:"https://www.metmuseum.org/art/collection/search/27792"},
  {k:'samurai',   y:1700,  disp:"c. 1700",     n:"Gusoku armour",            src:'The Met', lic:'CC0', cred:'Gift of Rosemarie and Leighton R. Longhi',   url:"https://www.metmuseum.org/art/collection/search/894753"},

  {k:'rocket',    y:1829,  disp:"1829",        n:"Stephenson’s Rocket",      src:'Wikimedia Commons', lic:'public domain', cred:'Samuel Smiles (engraving)', url:"https://commons.wikimedia.org/wiki/File:Rocket_(Smiles).jpg"},
  {k:'pennyfarthing',y:1871,disp:"1871",       n:"Penny-farthing",           src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'W. Bulach',               url:"https://commons.wikimedia.org/wiki/File:00_8333_Hochrad.jpg"},
  {k:'typewriter',y:1874,  disp:"1874",        n:"Sholes & Glidden typewriter",src:'Wikimedia Commons', lic:'CC0', cred:'Daderot',                        url:"https://commons.wikimedia.org/wiki/File:Remington_No._1_typewriter,_made_by_Remington_%26_Songs,_Ilion,_NY,_1873-1878,_the_first_Sholes_%26_Glidden_model_typewriter_made_by_Remington_-_Wisconsin_Historical_Museum_-_DSC02806.JPG"},
  {k:'phone',     y:1876,  disp:"1876",        n:"Bell telephone receiver",  src:'Wikimedia Commons', lic:'public domain', cred:'C. E. Scribner',         url:"https://commons.wikimedia.org/wiki/File:Bell_%22iron_box%22_telephone_receiver_1876.jpg"},
  {k:'bulb',      y:1880,  disp:"c. 1880",     n:"Edison lamps",             src:'Wikimedia Commons', lic:'CC BY-SA 3.0', cred:'Richard Warren Lipack',   url:"https://commons.wikimedia.org/wiki/File:1880EDISON1881LampsSOCKETSrwLIPACKowner.jpg"},
  {k:'flyer',     y:1903,  disp:"1903",        n:"Wright Flyer",             src:'Wikimedia Commons', lic:'public domain', cred:"New Student’s Reference Work", url:"https://commons.wikimedia.org/wiki/File:NSRW_Wright_Brothers_Aeroplane.png"},
  {k:'modelt',    y:1908,  disp:"1908",        n:"Ford Model T",             src:'Wikimedia Commons', lic:'CC0', cred:'Bernard Spragg. NZ',               url:"https://commons.wikimedia.org/wiki/File:Model_T_Ford_(13212007373).jpg"},
  {k:'camera',    y:1930,  disp:"c. 1930",     n:"Kodak Beau Brownie",       src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'Cquoi',                   url:"https://commons.wikimedia.org/wiki/File:Kodak_2A_Beau_Brownie.jpg"},

  {k:'aldrin',    y:1969,  disp:"1969",        n:"Buzz Aldrin on the Moon",  src:'Wikimedia Commons', lic:'public domain', cred:'NASA / Neil Armstrong',  url:"https://commons.wikimedia.org/wiki/File:Aldrin_Apollo_11_original.jpg"},
  {k:'chip',      y:1971,  disp:"1971",        n:"Intel 4004",               src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'Al. Struk',               url:"https://commons.wikimedia.org/wiki/File:4-%D0%B1%D1%96%D1%82%D0%BD%D0%B8%D0%B9_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D0%BE%D1%80_Intel_4004.jpg"},
  {k:'polaroid',  y:1972,  disp:"1972",        n:"Polaroid SX-70",           src:'Wikimedia Commons', lic:'CC BY 2.0', cred:'Michael Gatchell',           url:"https://commons.wikimedia.org/wiki/File:Polaroid_SX-70_camera.jpg"},
  {k:'rubik',     y:1974,  disp:"1974",        n:"Rubik’s Cube",             src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'Alessandro Di Pretoro',   url:"https://commons.wikimedia.org/wiki/File:Solved_Rubik%27s_cube.jpg"},
  {k:'walkman',   y:1979,  disp:"1979",        n:"Sony Walkman TPS-L2",      src:'Wikimedia Commons', lic:'CC BY-SA 4.0', cred:'Binarysequence',          url:"https://commons.wikimedia.org/wiki/File:Original_Sony_Walkman_TPS-L2.JPG"},
  {k:'mac',       y:1984,  disp:"1984",        n:"Macintosh 128K",           src:'Wikimedia Commons', lic:'CC BY 3.0', cred:'Sailko',                    url:"https://commons.wikimedia.org/wiki/File:Computer_macintosh_128k,_1984_(all_about_Apple_onlus).jpg"},
  {k:'gameboy',   y:1989,  disp:"1989",        n:"Nintendo Game Boy",        src:'Wikimedia Commons', lic:'public domain', cred:'Evan-Amos',              url:"https://commons.wikimedia.org/wiki/File:Game-Boy-FL.jpg"},
  {k:'neogeo',    y:1994,  disp:"1994",        n:"Neo Geo CD",               src:'Wikimedia Commons', lic:'public domain', cred:'Evan-Amos',              url:"https://commons.wikimedia.org/wiki/File:Neo-Geo-CD-TopLoader-wController-FL.jpg"},
  {k:'boombox',   y:1995,  disp:"1990s",       n:"CD boombox",               src:'Wikimedia Commons', lic:'CC BY 3.0', cred:'Andrevruas',                 url:"https://commons.wikimedia.org/wiki/File:AIWA_CSD-ES100_Compact_Disc_Stereo_Radio_Cassette_Recorder_(cropped).jpg"},
  {k:'vaccine',   y:2020,  disp:"2020",        n:"COVID-19 vaccine vial",    src:'Wikimedia Commons', lic:'CC0', cred:'Whispyhistory',                  url:"https://commons.wikimedia.org/wiki/File:COVID-19_vaccine_vial_(2024).jpg"}
].sort((a,b)=>a.y-b.y);

/* Five movements. Shared across all three directions so they are comparable —
   what differs is how each direction RENDERS a movement, not where the movements fall. */
window.MOVEMENTS = [
  {id:'deep',    from:-9999, to:-500, per:1, title:'the long thin start'},
  {id:'spread',  from:-499,  to:1300, per:2, title:'it starts happening in more places'},
  {id:'trade',   from:1301,  to:1800, per:3, title:'everything reaches everything'},
  {id:'machine', from:1801,  to:1960, per:4, title:'the machine century'},
  {id:'now',     from:1961,  to:9999, per:5, title:'all of it at once'}
];
