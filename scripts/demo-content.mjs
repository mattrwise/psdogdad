// Invented sample content for the Desert Springs demo. No real people or
// businesses. Thread authors are picked at random from the seeded members.

export const FIRST = ['Adrian','Beckett','Caleb','Dario','Elias','Felix','Gavin','Hollis','Ivan','Jasper','Kellan','Lucas','Mateo','Nolan','Owen','Pierce','Quentin','Rowan','Silas','Tobias','Ulises','Vance','Wesley','Xavier','Yosef','Zane','Marisol','Noor','Priya','Tamsin']
export const LAST = ['Alder','Brennan','Calloway','Dunmore','Ellery','Fairbanks','Garrity','Holloway','Iverson','Jessup','Kirkland','Lockridge','Maddox','Norwood','Oakes','Pemberton','Quill','Rutherford','Sandoval-Reyes','Thackeray','Underhill','Vasquez-Lin','Whitlock','Yarrow','Zimmerman']
export const DOGS = ['Biscuit','Waffles','Pickle','Juniper','Maple','Otis','Ziggy','Tango','Mochi','Bruno','Pepper','Clover','Atlas','Nacho','Sage','Gus','Luna','Rocket','Daisy','Banjo','Winnie','Cosmo','Pretzel','Fig','Rue','Moose','Penny','Hank','Olive','Taco']
export const BREEDS = ['French Bulldog','Labrador Retriever','Golden Retriever','Chihuahua','Mixed Breed','Dachshund','Border Collie','Australian Shepherd','Pug','Boston Terrier','Greyhound','Poodle','Shiba Inu','Corgi','Beagle','Rescue Mutt','Cavalier King Charles Spaniel','Husky','Whippet','German Shorthaired Pointer']

export const CATEGORIES = ['introductions','health-wellness','training-behavior','local-spots','nutrition-food','show-off','travel','events-meetups']

// [category, title, body, [specific replies]]
export const THREADS = [
  ['introductions','Hi from Mesa Verde, meet Biscuit','Just joined! Biscuit is a two year old French bulldog who thinks every stranger is a long lost friend. Looking for morning walk buddies and a vet recommendation.',['Welcome! Biscuit sounds like a delight. Mesa Verde Commons has a small-dog hour most mornings.','Same energy as my pug. You will love it here.','Seconding the Commons, we are there around 7 most days.']],
  ['introductions','New to Desert Springs with a rescue greyhound','Moved here last month with Juniper, a retired racer who is learning what a couch is. Any tips for a dog who has never seen a sliding glass door?','Tape a few sticky notes at nose height on the glass for a week, worked for our whippet.|Retired racers are the best. Welcome, and congrats on the adoption!|Keep walks short and early at first, the pavement here gets hot fast.'.split('|')],
  ['introductions','Foster fail, party of one','I fostered Waffles for two weeks. That was eight months ago. He is officially mine and officially in charge.',['Foster fail is the best kind of fail.','Eight months is basically a lifetime. Photos please!','Waffles is a great name.']],
  ['introductions','Hello! Two corgis and a lot of hair','Name is Dario, I live in Oasis Park with Tango and Mochi. If you see an orange fur tornado, that is us.',['Corgi hair is a lifestyle. Welcome!','We have a corgi playdate every other Sunday if you want in.','Is there a good vacuum recommendation thread? Asking for the corgis.']],
  ['introductions','Introducing Moose, 90 pounds of gentle','Moose is a Great Pyrenees mix and has never knowingly met a squirrel he disliked. Hoping to find other big dog people nearby.',['Big dog club checking in. Welcome Moose!','Do you have any shade strategy for double coated dogs? Curious what works for you.','Gentle giants are the best neighbors.']],
  ['introductions','Just adopted a senior pup','Olive is ten and slow and perfect. Looking for gentle walking routes and a vet who is good with seniors.',['Congratulations. Seniors are such a gift.','Saguaro Animal Hospital has been great with our fourteen year old.','The Arroyo Trail is flat and shaded, perfect pace for an easy stroll.']],
  ['health-wellness','How hot is too hot for walks?','It is 104 this week. I walk before 6am but the ground is still warm. What is your cutoff for pavement?','Seven second rule: hold the back of your hand on the pavement. If you cannot, neither can they.|We switch to grass and dirt trails and skip asphalt entirely in July.|Booties helped our shepherd, though it took a week to get used to them.'.split('|')],
  ['health-wellness','Signs of heat stress to watch for','Scared myself yesterday when Pepper started heavy panting and drooling on a short walk. Wrote down what the vet told me in case it helps someone.',['Thank you for sharing this. Glad Pepper is okay.','Also watch for bright red gums and wobbly walking. Cool water, not ice cold, and call the vet.','Pinning this thread in my brain for August.']],
  ['health-wellness','Foxtails in ears and paws','Found one in Rocket paw after the trail. Anyone have a go-to routine for checking after hikes?','Run your hands through every paw and ear every time. We call it the foxtail check.|A short summer haircut on paws makes them easier to spot.|If you see head shaking or sneezing, go to the vet. They can travel.'.split('|')],
  ['health-wellness','Anyone dealing with allergies?','Gus has been licking his paws raw this spring. Vet says environmental allergies. What has helped your dog?',['Wipes after every walk made a big difference for ours.','Ours did well on a fish-based diet plus a daily antihistamine, vet approved.','Ask about allergy testing, it narrowed things down for us.']],
  ['health-wellness','Dental care that actually works','Our vet says Maple needs a cleaning. Before I book it, what do you do to keep teeth good between visits?',['Daily brushing, the enzymatic poultry toothpaste is a hit with our dog.','Dental chews help a little but nothing replaces brushing.','Booked ours at Arroyo Specialty Vets, very gentle with anxious dogs.']],
  ['health-wellness','Vaccines and boarding requirements','Reading up on boarding and every place wants something different. Is there a standard list people follow?',['Rabies, DHPP and Bordetella is the usual trio.','Check the facility directly, some want canine influenza too.','Ask your vet for a printed record, it saves so much back and forth.']],
  ['training-behavior','Leash reactivity, where do I start?','Atlas lunges at other dogs on walks. He is friendly, just overexcited. We have been avoiding the park. Tips?','Distance is your friend. Start far enough away that he can still take treats, then close the gap slowly.|We did a reactive dog class and it changed everything. Highly recommend finding one with a small group.|Practice u-turns and treats for looking at you before he sees the other dog.'.split('|')],
  ['training-behavior','Recall tips that worked for us','Took six months but Clover now comes when called in the park. Sharing what worked for us in case it saves you time.',['Please share! Ours only comes when there is a cheese stick involved.','A long line was the thing for us. Never calling without a way to follow through.','Never calling your dog to end the fun. Call, treat, release.']],
  ['training-behavior','Separation anxiety after the holidays','Back to the office and Hank howls the whole time. Camera shows he calms down after about 40 minutes. What helps?',['Short practice absences, even 30 seconds, built up slowly.','A frozen stuffed toy right as you leave worked wonders.','Talk to your vet if it does not improve, medication can help some dogs.']],
  ['training-behavior','Barking at the doorbell','Penny goes nuts every time a delivery arrives. I have tried a lot of things. What actually stopped it for you?',['We trained a place cue on a mat and treated for staying there.','White noise near the door helped dampen the trigger.','Tell the delivery folks to knock softly, our driver now texts us instead.']],
  ['training-behavior','Puppy biting phase, please send hope','Fig is fourteen weeks and my hands look like I lost a fight with a rosebush.',['It passes, I promise. Redirect to a toy every single time.','Short naps help more than you would think, overtired puppies bite more.','We used a quick yelp and walk away for a few seconds.']],
  ['training-behavior','Loose leash walking drills','My arm is getting a workout. Any drills that helped you go from pulling to a calm walk?',['Stop moving every time the leash goes tight. Boring but it works.','Try a front-clip harness while you train.','Reward position, not just stopping. Treats at your knee.']],
  ['local-spots','Best shaded walking routes','Looking for walks that are actually shaded in summer. We are in Cactus Flats.','The Arroyo Trail has a canopy for about half a mile along the creek.|Cactus Flats Dog Park has shade sails over the benches now.|Any parking structure early morning is shady and quiet, a good trick on very hot days.'.split('|')],
  ['local-spots','Dog-friendly patios, summer edition','Which patios have misters and water bowls? We are tired of sweating through brunch.',['The Dusty Spur Cafe has misters and a bowl at every table.','Cholla Brewing Co. lets dogs on the lawn and has a water station.','Always call ahead, some patios change policies seasonally.']],
  ['local-spots','Cactus Flats Dog Park, anyone been?','Heard the new small dog area opened. Worth the drive?',['Yes! Separate small dog section and good drainage.','Busy on weekends, weekdays after 6 are calm.','Bring your own water, the fountain is hit or miss.']],
  ['local-spots','Groomers who are patient with anxious dogs','Looking for a groomer who takes it slow. Ziggy gets stressed at the dryer.',['Sunny Paws Grooming was great with our nervous pup.','Ask about a quiet appointment slot, some places offer one.','Mobile groomers are worth looking at for anxious dogs.']],
  ['local-spots','Where do you board when you travel?','Heading out of town for a week. Where do you leave your dog?',['Mesa Meadows Pet Resort, our dog loves it.','We use a sitter who stays at the house, easier on our guy.','Book early for holidays, boarding fills up fast.']],
  ['local-spots','Late night vet options','Had a scare last night and was glad I knew where the ER was. Posting here so more people know the options.',['Desert Springs Pet ER is open all night. Save the number in your phone now.','Mesa Verde Overnight Animal Hospital is also an option if you are on that side of town.','Good reminder. Adding both to my contacts.']],
  ['nutrition-food','Kibble vs fresh food','Thinking of switching Daisy to a fresh food subscription. Anyone made the jump?',['Our dog loves it but it is pricey. We mix it with kibble.','Talk to your vet first, especially if there are medical needs.','Transition slowly over ten days or so to avoid an upset stomach.']],
  ['nutrition-food','Treats under ten calories','Trying to train Pretzel without ballooning him. Treat ideas that are small and low cal?',['Tiny pieces of cooked chicken or green beans.','Use part of his regular kibble for easy exercises.','Freeze dried liver, crumble to pea size.']],
  ['nutrition-food','Slow feeders and bloat','Rue gobbles dinner in 20 seconds. Slow feeder or puzzle bowl, which worked for you?',['A snuffle mat turned dinner into a game for ours.','Lick mat plus a slow feeder, we rotate.','If you have a deep chested breed, ask your vet about bloat prevention.']],
  ['nutrition-food','Homemade frozen treats for the heat','Pupsicles are a hit here. Sharing my favorite recipe, two ingredients: plain yogurt and mashed banana. Freeze in a silicone tray.',['Making these this weekend!','We do watermelon cubes, no seeds or rind.','Peanut butter in a frozen Kong is the classic.']],
  ['nutrition-food','Weight management for Labs','Gus is five pounds over his ideal. Vet suggested cutting back but he gives me the eyes.',['Measure meals with a scale, not a scoop. It is eye opening.','Swap some treats for carrots.','Be strong! The eyes get less effective with time.']],
  ['show-off','Sunrise walk selfie','Caught Juniper in the golden light this morning. She looks like a painting.',['Absolutely gorgeous.','That coat in that light!','Need a print of this.']],
  ['show-off','Bandana collection update','Otis now has a bandana for every season. This is the Halloween edition.',['Peak dog fashion.','The tiny pumpkin pattern is perfect.','Where did you find these?']],
  ['show-off','Pool day for the pack','First time Pretzel and Mochi have tried the pool. Mochi lasted three seconds before demanding a towel.',['Tiny queen. Not built for water.','Love the life jackets!','Our husky would not get out all afternoon.']],
  ['show-off','Rescue anniversary','One year ago today Penny came home with a blanket and a bad attitude. She is now my best friend.',['Happy gotcha day Penny!','Gave me goosebumps. Congratulations.','What a glow up.']],
  ['show-off','Dog and cactus, a cautionary tale','Rocket got too close to a cholla this morning. All fine now but that was a long hour with tweezers.',['Ouch. We keep a comb handy to remove spines safely.','Poor guy. Glad he is okay.','Reminder to stay on marked trails with the dogs.']],
  ['travel','Road trip with a dog','Planning a long drive with Sage. Tips for breaks, water and keeping a dog calm?',['Stop every two hours for a walk and water.','A well fitted crash tested harness is worth it.','Never leave them in the car, even for a few minutes. Heat kills fast.']],
  ['travel','Flying with a small dog','First flight with Taco coming up. In cabin carrier. Anything I should know?',['Practice carrier time at home for weeks before.','Book a seat with floor space for the carrier, aisle seats are often better.','Ask your vet if the health certificate is required for your airline.']],
  ['travel','Dog-friendly hotels, mountains edition','Looking for a cabin with a fenced yard within a few hours of Desert Springs. Recommendations?',['Sundown Casitas in Agave Hills has fenced yards.','Check for pet fees, some places charge per night.','Look for places with a trail right outside the door.']],
  ['travel','Camping with the pack','First camping trip with two dogs. What do I need to bring that I will forget?',['Tie out line, collapsible bowls, and a towel for muddy paws.','Check for dog rules at the campground before you go.','Reflective collars for night potty trips.']],
  ['events-meetups','Sunday morning walk, who is in?',"Organizing a casual walk at Cactus Flats Dog Park this Sunday at 8am. All sizes welcome.",['Count us in!','Will bring extra water for the pups.','Is it okay to bring a shy dog?']],
  ['events-meetups','Yappy hour planning thread','Thinking about a monthly yappy hour at a dog friendly patio. What nights work for people?',['Thursdays work for me.','Maybe rotate venues so every neighborhood gets a turn.','Cholla Brewing Co. would be a fun first stop.']],
  ['events-meetups','Puppy playdate for under 6 months','Looking to start a small puppy social for pups still getting vaccinated. Anyone interested?',['Yes please. Fig needs friends.','Check with your vet first on timing and where it is safe.','I can host in my fenced yard.']],
  ['events-meetups','Volunteering at the humane society','Desert Springs Humane Society is looking for dog walkers on weekends. Anyone want to go together?',['Love this idea, in!','They also need foster homes if anyone is able.','Count me in for Saturday mornings.']],
  ['events-meetups','Trail clean up day','Organizing a trash pickup on the Arroyo Trail next month. Gloves and bags provided.',['Happy to help!','Can we bring dogs? Leashed of course.','Will spread the word at the dog park.']],
  ['events-meetups','Adoption day volunteers needed','Looking for help with an adoption event next weekend, setup crew and greeters.',['Signing up.','What time should we arrive?','Will bring folding tables.']],
  ['health-wellness','Tick and flea prevention in the desert','Is flea and tick prevention needed year round here? Getting mixed answers.',['Our vet says yes for fleas, ticks less common but still possible on trips.','Ask about prevention that covers both so you do not have to think about it.','Rotating products on the advice of your vet is fine too.']],
  ['training-behavior','Tricks to keep a smart dog busy','Border collie mix with way too much energy. Beyond fetch, what mental games do you do?',['Teach names of toys, then ask for them by name.','Scent games, hide treats around the house.','Short training sessions throughout the day tire them more than a long walk.']],
  ['local-spots','Pet supply stores worth supporting','Looking to shop local for dog food and toys. Who do you like?',['Happy Tails Pet Supply is great and the owners know every dog by name.','Wag & Wander Outfitters has good gear for hiking dogs.','Both do food delivery, I believe.']],
  ['introductions','Hi, I walk dogs for a living','Not a dog parent but I walk a lot of them in Willow Canyon. Looking to meet more of the community.',['Welcome! You probably know half our dogs already.','Do you have openings? Several of us are looking.','Thanks for all you do.']],
]

// Generic replies, used to round threads out to a realistic length.
export const POOL = {
  introductions: ['Welcome to the community!','So glad you joined, photos please!','Great to have you here.','What a cutie, welcome!','Hope to see you at a walk soon.'],
  'health-wellness': ['Thanks for posting this.','Good reminder, bookmarking.','Our vet said something similar.','Hope everything turns out okay.','This has been our experience too.'],
  'training-behavior': ['Consistency is everything with this.','We had the same issue, it does improve.','Keep sessions short and fun.','A good trainer can make a big difference.','Celebrate small wins!'],
  'local-spots': ['Thanks for the recommendation.','Adding this to my list.','We go there all the time.','Good to know, thank you!','Anyone want to meet up there?'],
  'nutrition-food': ['Thanks for sharing.','We tried that and it worked well.','Always check with your vet first.','Good tip!','Saving this recipe.'],
  'show-off': ['Adorable!','Look at that face.','Made my day.','So cute!','Love this.'],
  travel: ['Great tips, thanks.','We did something similar last year.','Have fun and share photos.','Safe travels!','Bookmarking this.'],
  'events-meetups': ['See you there.','Sounds like fun!','Will try to make it.','Thanks for organizing.','Count me in.'],
}

export const EVENTS = [
  ['Sunday Morning Dog Walk','08:00 AM','Cactus Flats Dog Park, Cactus Flats','A relaxed loop around the park followed by coffee. All sizes and ages welcome.'],
  ['Yappy Hour on the Patio','05:30 PM','Cholla Brewing Co., Oasis Park','Monthly meetup. Water bowls and treats provided. Dogs must be friendly and leashed.'],
  ['Puppy Social Hour','10:00 AM','Mesa Verde Commons, Mesa Verde','A small playdate for puppies under six months. Vaccinations up to date, please.'],
  ['Trail Clean Up Day','09:00 AM','Arroyo Trail trailhead','Bring gloves and a water bottle. Leashed dogs welcome.'],
  ['Adoption Day Volunteer Morning','09:30 AM','Desert Springs Humane Society','Help greet visitors, walk dogs and set up tables.'],
  ['Senior Dog Stroll','04:00 PM','Arroyo Trail, shaded section','A slow-paced walk for older dogs and their people.'],
]

// Business + contact data for the 30 pro listings, 6 per kind.
export const PROS = {
  training: [
    ['Sagebrush Canine Academy','Obedience and puppy basics for real life.'],
    ['Good Habits Dog Training','Gentle, reward-based coaching for every household.'],
    ['Arroyo Recall Co.','Reliable off-leash skills, built step by step.'],
    ['Calm Paws Behavior Studio','Help for reactive and anxious dogs.'],
    ['Trailhead Training','Hiking manners and trail confidence.'],
    ['Pawsitive Start','Puppy classes that set you up for success.'],
  ],
  grooming: [
    ['Sunny Paws Mobile Grooming','A full groom at your front door.'],
    ['Prickly Pear Grooming Van','Baths, trims and nail care, no kennel time.'],
    ['Tumbleweed Tidy-Up','Low-stress grooming for nervous dogs.'],
    ['Desert Rose Dog Spa','Spa days for fluffy dogs.'],
    ['The Sandstone Scrub','Quick baths and de-shedding treatments.'],
    ['Cactus Cuts Mobile Salon','Breed-specific cuts with a gentle touch.'],
  ],
  walking: [
    ['Roadrunner Dog Walking','Midday walks and small pack adventures.'],
    ['Early Bird Walkers','Cool morning walks before the heat.'],
    ['Mesa Miles','Active walks for high-energy dogs.'],
    ['Slow Stroll Seniors','Gentle walks for older dogs.'],
    ['Willow Canyon Walkers','Reliable daily walks, GPS tracked.'],
    ['Happy Trails Pet Care','Group hikes on weekends.'],
  ],
  sitting: [
    ['Home Sweet Home Pet Sitting','Overnights at your place so routines stay put.'],
    ['Oasis Overnights','Cozy boarding in a quiet home with a fenced yard.'],
    ['Agave Hills Pet Sitters','Drop-in visits and holiday coverage.'],
    ['Sundown Sitters','Sitting for dogs with special needs.'],
    ['Cozy Pup Retreat','Small-group boarding with plenty of cuddles.'],
    ['Stay & Play Sitters','Daytime sitting with lots of play.'],
  ],
  vets: [
    ['Sunrise House Call Vet','Wellness visits at home.'],
    ['Gentle Paws Mobile Veterinary','Stress-free exams and vaccines at your door.'],
    ['Saguaro Senior Pet Care','In-home care and comfort for senior pets.'],
    ['Mesa Mobile Veterinary','Mobile check-ups and lab work.'],
    ['Cactus Flats House Calls','Compassionate in-home veterinary care.'],
    ['Arroyo Home Vet','Preventive care and nutrition advice.'],
  ],
}
