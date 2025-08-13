// Guests data (inline)
var guests = [
    { name: "Aaron Sprinkle", projects: "Poor Old Lu, Rose Blossom Punch, Blank Books, Fair, Moonboy", imageUrl: "images/aaron-sprinkle.jpg" },
    { name: "Allan Aguirre", projects: "Scaterd Few, Spy Glass Blue, Men As Trees Walking", imageUrl: null },
    { name: "Bill Walden", projects: "Undercover, The Fourth Watch", imageUrl: "images/bill-walden.jpg" },
    { name: "Bryan Gray", projects: "The Blamed, Left Out, Mortal, Rocks In Pink Cement", imageUrl: "images/bryan-gray.jpg" },
    { name: "Chad Pearson", projects: "P is for Panda, Militia Group, Tooth & Nail Records", imageUrl: "images/chad-pearson.jpg" },
    { name: "Chad Wiggins", projects: "Officer Negative", imageUrl: "images/chad-wiggins.jpg" },
    { name: "Chris Brigandi", projects: "The Lifters, Wild Blue Yonder, LSU, Crystal Lewis, Nobody Special", imageUrl: "images/chris-brigandi.jpg" },
    { name: "Chris Colbert", projects: "Breakfast with Amy, Fluffy, Duraluxe, Blond Vinyl Records", imageUrl: null },
    { name: "Chuck Cummings", projects: "Aunt Bettys, Common Bond, Dakota Motor Company, Fanmail, Uthanda, Altar Billies, Lifesavers, LSU, Mike Knott, Blonde Vinyl Records", imageUrl: "images/chuck-cummings.jpg" },
    { name: "Crystal Lewis", projects: "Wild Blue Yonder, Metro One", imageUrl: "images/crystal-lewis.jpg" },
    { name: "Darryl Mitchell", projects: "Upside Down Room, Pony Express, In a Lonely Place, Death Valley Trio, Reducers", imageUrl: "images/darryl-mitchell.jpg" },
    { name: "Dave Mast", projects: "Echocast, Redline, The Ironside Collective", imageUrl: "images/dave-mast.jpg" },
    { name: "Dave Tosti", projects: "Pax 217", imageUrl: "images/dave-tosti.jpg" },
    { name: "Derri Daugherty", projects: "The Choir, Lost Dogs, The Swirling Eddies, Dead Artist Syndrome", imageUrl: null },
    { name: "Doug Thieme", projects: "Vengeance Rising, Once Dead, Die Happy", imageUrl: "images/doug-thieme.jpg" },
    { name: "Doug Van Pelt", projects: "HM Magazine, Lust Control, Moderator", imageUrl: "images/doug-van-pelt.jpg" },
    { name: "Edie Schmalz Goodwin", projects: "Headnoise", imageUrl: null },
    { name: "Eddie Harbour", projects: "Tom Con Staff, Moderator", imageUrl: "images/eddie-harbour.jpg" },
    { name: "Eric Campuzano", projects: "The Prayer Chain, Lassie Foundation, Cush, Starflyer 59, Stranger Kings, Northern Records", imageUrl: "images/eric-campuzano.jpg" },
    { name: "Gym Nicholson", projects: "Undercover, Steve Taylor Band, Dead Artist Syndrome, Moral DK", imageUrl: "images/gym-nicholson.jpg" },
    { name: "Jeff Cloud", projects: "Starflyer 59, Pony Express, Velvet Blue Records", imageUrl: "images/jeff-cloud.jpg" },
    { name: "Jeremy Alan Gould", projects: "The Rumors Are True Podcast, Moderator", imageUrl: "images/jeremy-alan-gould.jpg" },
    { name: "Jeremy Post", projects: "Black Eyed Sceva, Model Engine", imageUrl: "images/jeremy-post.jpg" },
    { name: "Jim Chaffin", projects: "The Crucified, Deliverance, The Blamed, NIV", imageUrl: "images/jim-chaffin.jpg" },
    { name: "Jim Worthen", projects: "Tooth & Nail Records", imageUrl: "images/jim-worthen.jpg" },
    { name: "Joey Svendsen", projects: "Emery, Bad Christian Podcast, Roster Music Club", imageUrl: "images/joey-svendsen.jpg" },
    { name: "John McNamara", projects: "441", imageUrl: "images/john-mcnamara.jpg" },
    { name: "John Nissen", projects: "Art, Graphic Design, T&N logo, Tomfest", imageUrl: "images/john-nissen.jpg" },
    { name: "Josh Hagquist", projects: "The Beautiful Mistake, Silage, Ember, Dogwood, Stranger Kings", imageUrl: "images/josh-hagquist.jpg" },
    { name: "Josh Kemble", projects: "Dogwood", imageUrl: "images/josh-kemble.jpg" },
    { name: "Judita Wignall", projects: "The Halo Friendlies", imageUrl: "images/judita-wignall.jpg" },
    { name: "Jyro Xhan", projects: "Mortal, Fold Zandura, Jyradelix, Cush", imageUrl: "images/jyro-xhan.jpg" },
    { name: "Kass", projects: "The Lifters", imageUrl: null },
    { name: "Kenny Riley", projects: "Common Bond", imageUrl: null },
    { name: "Kevin Lee", projects: "Lifesavors, LSU", imageUrl: null },
    { name: "Kim Tennberg", projects: "Flight 180, One Eighty, Alysons Anthem", imageUrl: null },
    { name: "Klank Diolosa", projects: "Klank, Circle of Dust", imageUrl: "images/klank-diolosa.jpg" },
    { name: "Leanor Ortega Till", projects: "5 Iron Frenzy, Moderator", imageUrl: "images/leanor-ortega-till.jpg" },
    { name: "Matt Johnson", projects: "Don't Know, Blenderhead, Roadside Monument", imageUrl: "images/matt-johnson.jpg" },
    { name: "Matt Wignall", projects: "Havalina Rail Co, Matt Death and the new Intellectuals, Jackson Rubio Records", imageUrl: "images/matt-wignall.jpg" },
    { name: "Mikee Bridges", projects: "Gecko Monks, Sometime Sunday, Twin Sister, Tragedy Ann", imageUrl: "images/mikee-bridges.jpg" },
    { name: "Michael Roe", projects: "77's, Lost Dogs", imageUrl: "images/michael-roe.jpg" },
    { name: "Mike Stand", projects: "Altar Boys, Clash of Symbols, Altar Billies", imageUrl: "images/mike-stand.jpg" },
    { name: "Mike Wright", projects: "Freeto Boat, Fighting Jacks, Ironside Collective", imageUrl: null },
    { name: "Mini Mendez", projects: "The Holidays, Glimmer Stars", imageUrl: "images/mini-mendez.jpg" },
    { name: "Natalie Bolanos", projects: "The Halo Friendlies", imageUrl: null },
    { name: "Neil Savoy", projects: "Stairwell, Stavesacre, The Ironside Collective", imageUrl: null },
    { name: "Orlando Greenhill", projects: "Havalina Rail Company", imageUrl: "images/orlando-greenhill.jpg" },
    { name: "Pat Servedio", projects: "Klank", imageUrl: null },
    { name: "Rich Moonstomp", projects: "The Israelites", imageUrl: null },
    { name: "Rob Gallas", projects: "Black and White World, Undercover, Moral DK", imageUrl: "images/rob-gallas.jpg" },
    { name: "Robert Goodwin", projects: "Headnoise", imageUrl: null },
    { name: "Sean Stopnik", projects: "Bloodshed, Rainy Days, Innermeans, Stairwell, Rock Kills Kid", imageUrl: "images/sean-stopnik.jpg" },
    { name: "Seth Roberts", projects: "Watashi Wa, MXPX, Lakes, Eager Seas", imageUrl: "images/seth-roberts.jpg" },
    { name: "Steve Pannier", projects: "Altar Boys, The Fourth Watch", imageUrl: "images/steve-pannier.jpg" },
    { name: "Ted Cookerly", projects: "EDL", imageUrl: "images/ted-cookerly.jpg" },
    { name: "Tim Mann", projects: "Focused", imageUrl: "images/tim-mann.jpg" },
    { name: "Tim Taber", projects: "The Prayer Chain, Cush, Red Strat, Transparent, Floodgate", imageUrl: "images/tim-taber.jpg" },
    { name: "Zak Shultz", projects: "The W's, The Militia Group, Stairwell, Tooth & Nail Records", imageUrl: null }
];

// Guest card rendering logic
(function() {
  var guestGrid = document.getElementById('guest-grid');
  if (guestGrid) {
    guests.forEach(function(guest) {
      var card = document.createElement('div');
      card.className = 'guest-card text-center';
      var imageHtml = '';
      if (guest.imageUrl) {
        imageHtml = '<img src="' + guest.imageUrl + '" alt="' + guest.name + '" class="w-full rounded-md shadow-lg mb-4">';
      } else {
        imageHtml = '<div class="w-full rounded-md shadow-lg mb-4 bg-gray-900 flex items-center justify-center" style="aspect-ratio: 2 / 3;"><span class="text-gray-500">No Image</span></div>';
      }
      card.innerHTML =
        imageHtml +
        '<h3 class="text-xl font-bold">' + guest.name + '</h3>' +
        '<p class="text-sm text-gray-400 italic mt-1">' + guest.projects + '</p>';
      guestGrid.appendChild(card);
    });
  }
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }
})();
// NOTE: Update imageUrl paths to absolute URLs if hosting images elsewhere for Carrd.co 