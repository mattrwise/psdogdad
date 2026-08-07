/**
 * Summer content, August through September 2026. One post a week, all of it
 * evergreen so it keeps earning after this summer is over.
 *
 * Posts carry a `publishedOn` date and go live on their own. The blog index and
 * the post pages revalidate hourly, so nothing needs a deploy on the day, and a
 * post that has not reached its date is not linked and 404s if guessed at.
 *
 * Ground rule, same as the rest of the site: no invented businesses, no invented
 * numbers. Where a post names a place, it is one already verified on the
 * Resources page, and anything time-sensitive (hours, prices) is written so the
 * reader is told to check rather than trust us.
 */

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  /** A boxed aside. Used sparingly, for the one thing worth pulling out. */
  | { type: 'callout'; tone: 'urgent' | 'info'; title: string; text: string }
  /** A list of links, internal or external. The Clear the Shelters post is only this. */
  | { type: 'links'; items: { label: string; href: string; note?: string }[] }

export type Post = {
  slug: string
  emoji: string
  title: string
  /** Card and search-result summary. One sentence, no cliffhangers. */
  description: string
  category: string
  minutes: number
  /** ISO date, Pacific. The post is live from this day onward. */
  publishedOn: string
  body: PostBlock[]
}

export const posts: Post[] = [
  // ── 1 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'emergency-and-after-hours-vets',
    emoji: '🚨',
    title: 'Emergency and After-Hours Vets in the Coachella Valley',
    description:
      'Where to go at 2am, what each place actually covers, and the three things to do before you need any of it.',
    category: 'Emergency',
    minutes: 6,
    // Live immediately rather than at the next midnight, because the Resources
    // page links straight at this post and that link must not 404.
    publishedOn: '2026-08-06',
    body: [
      { type: 'p', text: 'The worst time to work out where the emergency vet is, is while your dog is in the back seat and you are trying to read a map. This is the post to skim now, once, on a normal day, so that the answer is already in your head.' },
      { type: 'callout', tone: 'urgent', title: 'The short version', text: 'VEG ER for Pets in Palm Desert, (760) 249-2279, is open 24 hours a day, every day. If it is the middle of the night and you are not sure, that is the number. Put it in your phone now.' },

      { type: 'h2', text: 'Open around the clock' },
      { type: 'p', text: 'VEG ER for Pets, 73495 Hwy 111, Palm Desert, (760) 249-2279. Open 24 hours, seven days. No appointment. You talk to the vet yourself rather than through a front desk, and you can stay with your dog through the visit, which matters more than you would think at 3am.' },
      { type: 'p', text: 'Rancho Mirage Animal and Emergency Hospital, 71950 Hwy 111, Rancho Mirage, (442) 228-6857, is the valley\'s other emergency hospital and advertises round-the-clock care. If you are mid-valley it may be the shorter drive. Call while someone else drives, so they know what is coming.' },

      { type: 'h2', text: 'Long hours, but not overnight' },
      { type: 'p', text: 'Veterinary Urgent Care of the Desert, 36955 Cook St Ste 14A, Palm Desert, (760) 851-0668. This is the middle tier: the thing that is clearly wrong but probably not life-threatening. A limp that appeared out of nowhere, a torn nail, an ear that has gone from itchy to miserable, vomiting that will not stop.' },
      { type: 'p', text: 'Their hours run roughly 7am to 10pm Monday through Thursday and 7am to 8pm Friday through Sunday, but hours are exactly the sort of thing that changes without anyone updating a website. Ring before you drive.' },

      { type: 'h2', text: 'Poison, any hour' },
      { type: 'p', text: 'If your dog has eaten something and you do not know how bad it is, these two lines exist for that question specifically, and they take it 24 hours a day. Both charge a consultation fee, and both are worth it, because the vet you end up at will want the case number.' },
      { type: 'ul', items: [
        'ASPCA Animal Poison Control, (888) 426-4435',
        'Pet Poison Helpline, (855) 764-7661',
      ] },
      { type: 'p', text: 'Desert-specific things that land dogs on this call: rat bait from a neighbour\'s garage, oleander clippings in green waste, sago palm (the seeds are the worst part), grapes and raisins, xylitol in sugar-free gum, and the cannabis edibles that turn up in Palm Springs vacation rentals more often than anyone likes to admit. Bring the packaging if there is any.' },

      { type: 'h2', text: 'What to do before you need any of this' },
      { type: 'p', text: 'Three things, fifteen minutes total, and you will never have to think about it again.' },
      { type: 'ol', items: [
        'Put all four numbers above in your phone. Name the first one "VET ER" so it sorts to the top and anyone borrowing your phone can find it.',
        'Register with a regular vet now, before there is a problem. An ER will treat a dog it has never met, but a clinic that already has your dog\'s history makes the follow-up far easier. The Resources page lists the ones in the valley with addresses and numbers.',
        'Decide in advance how you would pay for a bad night. Emergency care is expensive and the decision point arrives when you are least able to think. Pet insurance, a card you keep clear, CareCredit, a savings buffer, whichever, just have an answer.',
      ] },

      { type: 'h2', text: 'When in doubt, go' },
      { type: 'p', text: 'Dog people talk themselves out of the ER constantly, usually at 1am, usually with the phrase "let\'s see how they are in the morning". Some things genuinely cannot wait until morning: heatstroke, bloat in a deep-chested dog, a snake bite, laboured breathing, pale or white gums, a seizure that will not stop, collapse, or a dog that has been hit by anything.' },
      { type: 'p', text: 'An unnecessary trip costs you an exam fee and some sleep. The other mistake costs more than that.' },

      { type: 'callout', tone: 'info', title: 'Save this page', text: 'Every number here is also on the Resources page, tappable, with map links. Add it to your home screen and you have the whole list one press away.' },

      { type: 'links', items: [
        { label: 'Resources: emergency vets, with map and directions', href: '/resources#emergency' },
        { label: 'High Heat Guide, including heatstroke warning signs', href: '/resources/heat' },
      ] },
    ],
  },

  // ── 2 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'clear-the-shelters-2026',
    emoji: '🏠',
    title: 'Clear the Shelters Is This Weekend',
    description:
      'The Palm Springs Animal Shelter is running its adoption drive on August 15 and 16. Links only, go straight to the source.',
    category: 'Local',
    minutes: 1,
    publishedOn: '2026-08-15',
    body: [
      { type: 'p', text: 'Short one. The Palm Springs Animal Shelter is running its annual Clear the Shelters adoption drive this weekend, Saturday August 15 and Sunday August 16, at 4575 E Mesquite Ave. Check their own page for the hours, they extend them for this and we would rather you read it from the source than from us.' },
      { type: 'p', text: 'We are not a partner, a sponsor, or in any way involved. We are not running anything alongside it and there is nothing to RSVP to. This is a post that exists to point you at the people actually doing the work, so here are the links.' },
      { type: 'links', items: [
        { label: 'Palm Springs Animal Shelter', href: 'https://psanimalshelter.org/', note: 'Adoptable dogs, fees, hours and requirements, straight from the source' },
        { label: 'Clear the Shelters', href: 'https://www.cleartheshelters.com/', note: 'The national campaign and its participating shelters' },
        { label: 'Shelter phone: (760) 416-5718', href: 'tel:+17604165718', note: 'Ring ahead if you are driving in from out of the valley' },
      ] },
      { type: 'p', text: 'Two practical notes, and then we will get out of the way. Adoption events get busy and hot, so if you are bringing your current dog to meet a candidate, go early and take water for both. And if you are not adopting this weekend, shelters need fosters and supplies in August more than in any other month, which is worth ten minutes of your time on their site.' },
      { type: 'links', items: [
        { label: 'Our first meetup is Saturday, October 17', href: '/events', note: 'If you do come home with someone this weekend, bring them' },
      ] },
    ],
  },

  // ── 3 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'seven-second-pavement-test',
    emoji: '✋',
    title: 'The Seven-Second Pavement Test',
    description:
      'The back of your hand, seven seconds, and the only walk-timing rule that survives a Palm Springs summer.',
    category: 'Heat Safety',
    minutes: 4,
    publishedOn: '2026-08-21',
    body: [
      { type: 'p', text: 'Here is the entire test. Press the back of your hand flat against the pavement and hold it there for seven seconds. If you have to lift it before you get to seven, it is too hot to walk your dog on.' },
      { type: 'p', text: 'The back of the hand, not the palm. Palms are calloused and will lie to you.' },

      { type: 'h2', text: 'Why seven seconds and not a thermometer' },
      { type: 'p', text: 'Because you will actually do it. Air temperature is a bad guide here: asphalt that has been baking all afternoon can sit thirty to fifty degrees above the air, so a pleasant-sounding 95° evening can still mean pavement in the 130s. And it stays there. Asphalt releases heat for hours after sunset, which is why "we went at eight, it was fine" is a sentence that has burned a lot of paws.' },
      { type: 'p', text: 'The test cuts through all of that. It measures the actual surface your dog is about to stand on, right now, at the spot you are standing.' },

      { type: 'callout', tone: 'urgent', title: 'What a burn looks like', text: 'Limping, refusing to walk, licking or chewing at the paws, or pads that have gone darker than usual, look pink and raw, or have started to peel. Do not walk them home on it. Carry the dog if you can, get to shade, run cool water over the pads, and call your vet, burned pads infect easily.' },

      { type: 'h2', text: 'The rest of the surfaces' },
      { type: 'ul', items: [
        'Dark asphalt is the worst thing in the desert and the thing most walks start on.',
        'Concrete sidewalks run cooler than asphalt but not by as much as people assume. Test them too.',
        'Artificial turf gets startlingly hot. It is not a safe alternative to grass.',
        'Metal, manhole covers, truck beds, the metal edge strips on driveways, will burn on contact.',
        'Sand and decomposed granite hold heat well into the evening.',
        'Real grass and shaded dirt are your friends and the reason park loops beat sidewalk loops all summer.',
      ] },

      { type: 'h2', text: 'What this actually means for your week' },
      { type: 'p', text: 'From roughly June through September, it means walks happen before 8am or well after dark, and the test decides which. It means you park closer, or carry a small dog across the lot. It means the ten-minute sniff around the block at 4pm is off the table, and something indoors takes its place.' },
      { type: 'p', text: 'Booties and paw wax help, if your dog will tolerate them, and plenty will not. Treat them as a way to cross a hot bit safely, not as permission to take a normal walk on a 130° surface.' },

      { type: 'h2', text: 'One habit worth building' },
      { type: 'p', text: 'Do the test before you open the car door, not after you have already got the dog out. Once they are on the ground, sniffing, keen, you are far more likely to talk yourself into "it is only a short one".' },

      { type: 'links', items: [
        { label: 'High Heat Guide: walk timing, heatstroke signs, everyday rules', href: '/resources/heat' },
        { label: 'Training guide: Keeping Your Dog Safe in Desert Heat', href: '/training/desert-heat-safety' },
      ] },
    ],
  },

  // ── 4 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'heat-stroke-signs-and-the-car-ride',
    emoji: '🌡️',
    title: 'Heat Stroke: The Signs, and What to Do in the Car on the Way to the Vet',
    description:
      'How to tell heat stroke from ordinary panting, and the specific things to do during the drive that change the outcome.',
    category: 'Heat Safety',
    minutes: 7,
    publishedOn: '2026-08-28',
    body: [
      { type: 'p', text: 'Heat stroke kills dogs in the Coachella Valley every summer, and it moves faster than almost anyone expects. It is not a wait-and-see condition. The window between "he seems off" and organ damage can be under half an hour.' },
      { type: 'p', text: 'This post is in two halves: recognising it, and the drive. The drive matters because cooling that starts in the car, rather than in the exam room, measurably improves how these cases end.' },

      { type: 'h2', text: 'Panting versus trouble' },
      { type: 'p', text: 'Every dog pants in August. Normal panting settles within a few minutes once your dog stops moving and gets into shade or air conditioning, and the dog stays interested in things. Heat stroke does not settle.' },
      { type: 'p', text: 'What to look for, roughly in the order it tends to appear:' },
      { type: 'ul', items: [
        'Frantic, non-stop panting that does not ease off with rest',
        'Thick, ropey drool, or suddenly much more saliva than usual',
        'Gums that are bright brick red early on, then pale, grey or blue-ish later, which is much worse',
        'Vomiting or diarrhoea, sometimes with blood in it',
        'Wobbling, a drunk-looking gait, bumping into things',
        'Glassy staring, not responding to their name, confusion',
        'Collapse, tremors, or a seizure',
      ] },
      { type: 'p', text: 'Any of the last three means you are already past the point of debating it.' },

      { type: 'callout', tone: 'urgent', title: 'Highest risk, lowest margin', text: 'Flat-faced dogs, bulldogs, French bulldogs, pugs, boxers, cannot cool themselves efficiently and go down far faster than other breeds. Same for seniors, puppies, overweight dogs, thick double coats, and any dog with heart or airway problems. For these dogs, halve every guideline you have ever read.' },

      { type: 'h2', text: 'The first two minutes, before you move' },
      { type: 'ol', items: [
        'Stop everything. No more walking, no "let\'s just get back to the car first" if the car is far.',
        'Get into shade, or better, air conditioning.',
        'Start pouring or hosing cool water over them, particularly the belly, the armpits, the groin and the paws. Cool tap water, not ice water.',
        'Offer small amounts of water to drink if they are alert enough to swallow. Do not force it, and never pour water into the mouth of a dog that is not fully conscious.',
        'Call the emergency vet and tell them you are coming with a suspected heat stroke. VEG ER for Pets, (760) 249-2279, is open 24 hours.',
      ] },
      { type: 'p', text: 'Two things people get wrong here, both from good intentions. Do not use ice or ice baths: extreme cold makes surface blood vessels clamp shut and traps heat inside, which is the opposite of what you want. And do not drape a wet towel over the dog and leave it, a towel sitting on a hot dog becomes a warm blanket within a minute. Wet, wring out, reapply, or better, keep water moving over them.' },

      { type: 'h2', text: 'The drive' },
      { type: 'p', text: 'This is the part nobody plans, and it is where you can genuinely help. If you can, have someone else drive.' },
      { type: 'ul', items: [
        'Air conditioning on full, vents aimed at the dog, not at the windscreen.',
        'Keep the water going the entire way. A bottle poured slowly over the belly and armpits, repeatedly, does more than one big soak at the start.',
        'Air movement over wet fur is what actually removes heat. A cracked window adding airflow on top of the AC helps. Wet plus moving air beats wet alone.',
        'Wet, wrung-out towels under the armpits and between the back legs. Swap them out as they warm up rather than leaving them in place.',
        'Stop cooling once they seem to be recovering and the panting eases. Dogs cooled aggressively all the way to the clinic can overshoot into hypothermia, which brings its own problems.',
        'Do not give any medication. Human fever reducers are toxic to dogs.',
        'Ring ahead if you have not already, so a team is waiting at the door instead of finding out when you walk in.',
      ] },

      { type: 'h2', text: 'Go even if they perk up' },
      { type: 'p', text: 'This is the most important paragraph here. Dogs often look substantially better after ten minutes of cooling, and that is exactly when people turn the car around. Heat stroke damages kidneys, the gut lining and the clotting system, and that damage shows up hours later, in a dog who seemed fine at the time.' },
      { type: 'p', text: 'If you cooled a dog because you thought it was heat stroke, that dog needs to be seen the same day. Bloodwork and a few hours on fluids is the difference between a scare and a much worse week.' },

      { type: 'h2', text: 'Where these cases come from' },
      { type: 'p', text: 'Not from anyone being careless, mostly. From a walk that ran twenty minutes longer than planned. From a game of fetch on grass that felt fine to a human. From a patio at lunchtime with no shade at the dog\'s level. From a car with the engine running that stalled. From a garage or a yard with no water, on a day that turned out hotter than the forecast.' },
      { type: 'p', text: 'Never leave a dog in a parked car here, not for a minute, not with the windows down. Interiors pass 120° in about ten minutes in a desert summer.' },

      { type: 'links', items: [
        { label: 'Emergency and after-hours vets, with numbers', href: '/blog/emergency-and-after-hours-vets' },
        { label: 'The seven-second pavement test', href: '/blog/seven-second-pavement-test' },
        { label: 'High Heat Guide', href: '/resources/heat' },
      ] },
    ],
  },

  // ── 5 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'hydration-and-electrolytes',
    emoji: '💧',
    title: 'Hydration and Electrolytes: What Actually Helps',
    description:
      'Most of what gets sold for canine hydration is unnecessary. Here is the short list of what genuinely moves the needle in a desert summer.',
    category: 'Health',
    minutes: 6,
    publishedOn: '2026-09-04',
    body: [
      { type: 'p', text: 'Search "dog electrolytes" in August and you will be sold powders, tablets, flavoured waters and a lot of confidence. Most of it is aimed at you, not at your dog. Here is what actually matters when it is 112° outside.' },

      { type: 'h2', text: 'Water is the intervention' },
      { type: 'p', text: 'Almost every dehydrated dog in the valley is dehydrated because they did not drink enough water, not because they ran low on a trace mineral. A healthy dog eating normal food gets the electrolytes it needs from that food. The job is to get more plain water into them, more often.' },
      { type: 'p', text: 'The rough baseline is about an ounce of water per pound of body weight per day, and desert summer, heavy panting and any real activity all push that up. Panting itself is a significant water loss, which is easy to forget because it is invisible.' },

      { type: 'h2', text: 'The things that genuinely work' },
      { type: 'ul', items: [
        'More bowls, in more rooms. The single highest-yield change anyone makes. Dogs drink opportunistically; a bowl they walk past is a bowl they use.',
        'Cool, fresh, changed twice a day. Water that has been sitting out in a warm house all day is unappealing and dogs will simply drink less of it.',
        'Water on every single outing, including the short ones. A collapsible bowl lives in the car and one lives in the bag. A dog cannot drink from a bottle you are squeezing at it nearly as well as from a bowl.',
        'Wet food, or water stirred into dry food. Adding water to kibble is the easiest way to move a meaningful volume into a dog that under-drinks.',
        'Ice cubes as treats, if your dog likes them. Fine for a healthy dog. This is not the same as ice-bathing an overheating dog, which you should not do.',
        'Broth, low sodium and with absolutely no onion or garlic in it, splashed into the bowl to make water interesting for a fussy drinker.',
        'A shaded kiddie pool. Half the point is cooling, but dogs also drink far more when there is water they are already standing in.',
      ] },

      { type: 'h2', text: 'When electrolytes are actually the answer' },
      { type: 'p', text: 'There is a real place for them, it is just narrower than the marketing suggests. Genuine electrolyte loss follows sustained heavy exertion in heat, or fluid lost through prolonged vomiting or diarrhoea. A long hike at altitude, a working dog on a hot day, a dog recovering from a bad gut episode.' },
      { type: 'p', text: 'If you are in that territory, ask your vet what to use and in what amount for your dog\'s weight, rather than reaching for the human sports drink in the fridge. Those are formulated for a 180-pound person and are usually loaded with sugar, and the sugar-free versions may contain xylitol, which is seriously toxic to dogs. Never give a sugar-free anything to a dog without checking the label for xylitol.' },
      { type: 'p', text: 'For everyday desert life, with a normal healthy dog eating normal food: plain water, more of it, more often.' },

      { type: 'h2', text: 'Checking whether they are behind' },
      { type: 'p', text: 'Two quick checks, neither of which is definitive but both of which are worth knowing.' },
      { type: 'ul', items: [
        'Gums should be wet and slick. Tacky or dry gums suggest dehydration.',
        'Skin tent: gently lift the skin between the shoulder blades and let go. It should drop straight back. If it stays tented, that is a bad sign. Loose-skinned and older dogs give a less reliable reading here.',
        'Urine that has gone dark and concentrated, or a dog that has not needed to go out much.',
        'Sunken-looking eyes, lethargy, loss of appetite.',
      ] },
      { type: 'callout', tone: 'urgent', title: 'When this stops being a hydration question', text: 'A dog that is genuinely dehydrated, that is vomiting and cannot keep water down, or that is dehydrated on top of heat exposure, needs fluids under the skin or by drip, not a bowl. That is a vet visit, not a home fix.' },

      { type: 'h2', text: 'A note on drinking too fast' },
      { type: 'p', text: 'A dog that comes in overheated and empties a bowl in six seconds can vomit it straight back up, and in deep-chested breeds a huge fast drink is one of the things associated with bloat. Offer moderate amounts, frequently, rather than one enormous bowl after exercise. A slow-drink bowl, or a large bowl with a clean object in it to drink around, sorts out the enthusiastic ones.' },

      { type: 'links', items: [
        { label: 'Heat stroke: the signs, and the car ride', href: '/blog/heat-stroke-signs-and-the-car-ride' },
        { label: 'High Heat Guide', href: '/resources/heat' },
      ] },
    ],
  },

  // ── 6 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'indoor-enrichment',
    emoji: '🧩',
    title: 'Indoor Enrichment: Snuffle Mats, Frozen Kongs and Scent Games',
    description:
      'Twenty minutes of nose work tires a dog out more than a mile of sidewalk. What to do with a dog stuck inside for four months.',
    category: 'Enrichment',
    minutes: 7,
    publishedOn: '2026-09-11',
    body: [
      { type: 'p', text: 'Desert summer takes your main tool away. You cannot walk the energy off a dog when the pavement is 135° and it is still 100° at nine at night. What is left is the dog\'s nose, and it turns out the nose is better at this than walking ever was.' },
      { type: 'p', text: 'A dog\'s sense of smell takes up a genuinely enormous share of its brain. Sustained sniffing is real cognitive work, and it produces the same satisfied, flopped-on-the-tiles dog that a long walk does, in a fraction of the time, indoors, in the air conditioning.' },

      { type: 'h2', text: 'Start here: feed them out of a bowl less' },
      { type: 'p', text: 'The single easiest change, and it costs nothing. A bowl of kibble is thirty seconds of a dog\'s day. The same kibble delivered through work is twenty minutes of it. You are not adding food or effort, only rerouting food you were already giving them.' },

      { type: 'h2', text: 'Snuffle mats' },
      { type: 'p', text: 'A mat of fabric strips that you scatter dry food into. The dog works through it nose-first. Ten to fifteen minutes of genuine effort for most dogs, and it is the lowest-skill option on this list, nothing to teach, just put it down.' },
      { type: 'p', text: 'A folded towel with kibble rolled into it does the same job for free, as does a muffin tin with food in the cups and tennis balls on top. Supervise the towel version with a dog that likes to eat fabric, and any of these with a dog that resource-guards food.' },

      { type: 'h2', text: 'Frozen Kongs and the freezer shelf' },
      { type: 'p', text: 'A stuffed rubber toy, frozen solid, is the workhorse of desert summer: enrichment and cooling in one object. Frozen makes it last three to five times longer than unfrozen.' },
      { type: 'p', text: 'Fill with some combination of soaked kibble, plain canned pumpkin, plain unsweetened yoghurt, wet food, or mashed banana, then plug the end and freeze overnight. Two rules: check any peanut butter for xylitol, which is toxic to dogs and turns up in sugar-free spreads, and count what you put in as part of the day\'s food rather than on top of it.' },
      { type: 'p', text: 'Make four or five at a time on a Sunday and keep a shelf of them. A frozen Kong at 4pm is the thing that replaces the afternoon walk from June to September.' },

      { type: 'h2', text: 'Scent games' },
      { type: 'p', text: 'This is where the real tiredness comes from. Three to build up through:' },
      { type: 'ol', items: [
        'Find It. Toss a treat where the dog can see it land, say "find it". Repeat until the phrase means something. Then start hiding them while the dog waits in another room, and make the hides gradually harder: behind a chair leg, under the lip of a rug, up on a low shelf.',
        'The muffin tin and the box pile. Treats under a few of a dozen upturned cups, or in one of eight cardboard boxes on the floor. The dog has to check them all. Cheap, disposable, endlessly repeatable.',
        'Which hand. Two closed fists, one with food. The dog indicates. Absurdly simple, and dogs love it.',
      ] },
      { type: 'p', text: 'Fifteen or twenty minutes of hard sniffing is a lot for most pet dogs. If your dog is still bouncing, make the hides harder rather than the sessions longer.' },

      { type: 'h2', text: 'The rest of the toolkit' },
      { type: 'ul', items: [
        'Lick mats, smeared and frozen. Calming, and useful for nail trims and thunderstorms.',
        'Puzzle feeders with sliders and lids, for dogs who have outgrown the snuffle mat. Start on the easy setting, a dog that gives up learns to give up.',
        'Trick training, five minutes at a time. Spin, touch, chin rest, go to mat. Mentally tiring and it improves your handling.',
        'Stairs, if you have them, and hallway recalls between two people with treats at each end. This is where indoor physical exercise actually comes from.',
        'Chews appropriate to your dog\'s chewing style, supervised. Long-lasting, self-directed, and genuinely calming.',
        'A cardboard box with kibble and scrunched paper in it. Free, and a good number of dogs prefer it to anything you can buy.',
      ] },

      { type: 'callout', tone: 'info', title: 'Rotate, do not accumulate', text: 'Keep two thirds of the toys in a cupboard and swap the sets weekly. A toy that vanishes for ten days comes back new. This works far better than buying more.' },

      { type: 'h2', text: 'What a summer day looks like' },
      { type: 'p', text: 'Short walk before 8am, pavement tested. Breakfast out of a snuffle mat or a puzzle. Five minutes of trick training mid-morning. Frozen Kong in the hot part of the afternoon. A scent game after dinner. A short walk once it has genuinely cooled, or not, if it has not.' },
      { type: 'p', text: 'That is a well-exercised dog, and none of it required leaving the house.' },

      { type: 'links', items: [
        { label: 'Dog-friendly indoor spots in Palm Springs', href: '/blog/dog-friendly-indoor-spots' },
        { label: 'High Heat Guide', href: '/resources/heat' },
      ] },
    ],
  },

  // ── 7 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'dog-friendly-indoor-spots',
    emoji: '❄️',
    title: 'Dog-Friendly Indoor Spots in Palm Springs',
    description:
      'Air-conditioned places you can actually take a dog, and an honest note on why that list is shorter than the internet suggests.',
    category: 'Local',
    minutes: 5,
    publishedOn: '2026-09-18',
    body: [
      { type: 'p', text: 'By September everyone has read every summer enrichment article going and would quite like to leave the house with their dog. So: where can you actually go indoors, in air conditioning, with a dog, around Palm Springs?' },
      { type: 'p', text: 'Fewer places than the listicles claim, and it is worth knowing why before you drive somewhere.' },

      { type: 'h2', text: 'The rule that shapes the whole list' },
      { type: 'p', text: 'California health code keeps pet dogs out of the indoor dining areas of restaurants and out of most places that prepare or sell food. That is why Palm Springs is full of dog-friendly patios and almost empty of dog-friendly dining rooms, and it is why in July a "dog-friendly restaurant" is often not usable at all.' },
      { type: 'p', text: 'Service animals are a separate legal category and go where their handler goes. That is not what this post is about, and please do not present a pet as a service dog to get inside somewhere, it makes life materially harder for people who depend on a real one.' },
      { type: 'p', text: 'What is left is retail, and it is better than it sounds.' },

      { type: 'h2', text: 'Pet supply stores' },
      { type: 'p', text: 'The reliable option. Air conditioned, dogs unambiguously welcome, and a slow lap of the aisles is a genuine outing for a dog: new smells, new surfaces, strangers, and a lot to look at. Petco in Palm Desert, 72453 Hwy 111, is the full-service one on our Resources page.' },
      { type: 'p', text: 'Treat it as a training session rather than shopping. Fifteen minutes of loose-leash work down a quiet aisle, some sits with distractions, a treat from a member of staff if they offer. Go on a weekday morning, not a Saturday afternoon, and give other dogs room, an aisle is a narrow space to pass a reactive dog in.' },

      { type: 'h2', text: 'Indoor daycare, for the days it is genuinely unbearable' },
      { type: 'p', text: 'Not somewhere you hang out, but the honest answer for a high-energy dog in a 115° week: a few hours of indoor play with other dogs. Palm Springs has several, all on the Resources page with addresses and numbers, and all will want vaccination records and a temperament assessment before a first visit, so ring ahead rather than turning up.' },
      { type: 'ul', items: [
        "Doggie's Day Out, 740 Vella Rd Ste 770, Palm Springs, (760) 422-6259",
        'Dogs R Dope, 888 E Research Dr, Palm Springs, (760) 778-3647',
        'Tailwaggers, 1124 E Tahquitz Canyon Way, Palm Springs, (323) 464-9600',
        'Barkingham Pet Hotel, 73650 Dinah Shore Dr, Palm Desert, (760) 699-8328',
      ] },

      { type: 'h2', text: 'Independent shops, with a phone call first' },
      { type: 'p', text: 'A good number of the independent retailers along Palm Canyon Drive will happily have a well-behaved dog in the shop, particularly in low season when the town is quiet. Home goods, clothing, galleries, bookshops. There is no reliable published list of which, because it is a decision each owner makes and it changes.' },
      { type: 'p', text: 'So the method is: ring, or read the door. We have deliberately not published a list of specific boutiques here, because we have not verified them, and a list of shops that turn you away at the door is worse than no list. If you find one that welcomes dogs, tell us and it goes on the Resources page with an address attached.' },

      { type: 'h2', text: 'Patios, which come back in October' },
      { type: 'p', text: 'Worth saying plainly, because it is the answer for most of the year: Palm Springs patio culture is excellent and genuinely dog-friendly, and from mid-October it is the best thing about the place. Bootlegger Tiki, Eight4Nine, Cheeky\'s and Workshop are all on the Resources page. Right now they are a heat-safety problem. In six weeks they are the plan.' },

      { type: 'callout', tone: 'info', title: 'Two things to check anywhere indoors', text: 'Floor temperature at the door, some entryways and loading areas are brutal, and how narrow the space is. A shop full of breakable things at tail height is not a relaxing outing for either of you.' },

      { type: 'links', items: [
        { label: 'Resources: daycare, boarding and pet supply stores', href: '/resources' },
        { label: 'Indoor enrichment, for the days you stay home', href: '/blog/indoor-enrichment' },
        { label: 'Suggest a resource, if you know somewhere we have missed', href: '/resources' },
      ] },
    ],
  },

  // ── 8 ────────────────────────────────────────────────────────────────────────
  {
    slug: 'almost-there',
    emoji: '🌤️',
    title: 'We Are Almost There',
    description:
      'The heat is nearly done, the mornings are turning, and our first meetup is Saturday, October 17 at 8am.',
    category: 'Community',
    minutes: 3,
    publishedOn: '2026-09-25',
    body: [
      { type: 'p', text: 'If you have made it this far into a Coachella Valley summer with a dog, you have earned the next bit. Late September is when the mornings start turning: still hot by the afternoon, but the early part of the day quietly becomes usable again, and by mid-October the pavement at 8am is simply not a problem any more.' },
      { type: 'p', text: 'Which is why the first PS Dog Dad meetup is when it is.' },

      { type: 'callout', tone: 'info', title: 'Saturday, October 17, 8am', text: 'Ruth Hardy Park, 700 E Tamarisk Rd, Palm Springs. A morning walk, then coffee. Free, no dues, nothing to bring except water and poop bags.' },

      { type: 'h2', text: 'Why one date, one park, one time' },
      { type: 'p', text: 'Because the alternative is a poll, and a poll about which of four parks on which of three Saturdays is how a first meetup quietly never happens. So: one park, one time, and the only decision left is whether you show up.' },
      { type: 'p', text: 'Ruth Hardy Park because it has the fenced off-leash area, it is central, there is shade, and there is parking on Tamarisk with more on Avenida Caballeros. 8am because October mornings here are usually still under 80°, and because the dogs are at their best then.' },

      { type: 'h2', text: 'What it will actually be like' },
      { type: 'p', text: 'A handful of people standing around with dogs, then a walk, then some of us going for coffee. That is the whole thing. Nobody is going to make you introduce yourself to a circle. There is no talk, no committee, no sign-up sheet at the gate.' },
      { type: 'p', text: 'If your dog is reactive, nervous, or just does not enjoy other dogs, come anyway and stay at the edge with us. The park is big and nobody will push your dog into saying hello to anything. Plenty of us are in the same position.' },

      { type: 'h2', text: 'The last few weeks of heat' },
      { type: 'p', text: 'October is close but it is not here, and September afternoons in the valley still put dogs in the emergency room. The pavement test still applies, walks are still early or late, and the frozen Kongs still earn their place in the freezer. Do not let the calendar talk you into a 4pm walk in the first week of October.' },

      { type: 'h2', text: 'Between now and then' },
      { type: 'p', text: 'RSVP, if you have not. It is genuinely useful, not a vanity number, it tells us roughly how many people to look out for and it means you get a note if anything changes. It takes one press.' },
      { type: 'p', text: 'And if you have been meaning to join, this is the moment. The account is free, it takes two minutes, and it is what lets you RSVP.' },

      { type: 'links', items: [
        { label: 'RSVP for the first meetup', href: '/events' },
        { label: 'Join free', href: '/members/join' },
        { label: 'The seven-second pavement test, still relevant in October', href: '/blog/seven-second-pavement-test' },
      ] },
    ],
  },
]

/** en-CA gives ISO-shaped output, which sorts and compares as a plain string. */
function pacificToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function isPublished(post: Post, now: Date = new Date()): boolean {
  return post.publishedOn <= pacificToday(now)
}

/** Newest first. The only list any visitor-facing page should render. */
export function publishedPosts(now: Date = new Date()): Post[] {
  return posts
    .filter(post => isPublished(post, now))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
}

export function getPost(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug)
}

/** The two posts shown at the foot of a post, most recent published first. */
export function relatedPosts(slug: string, now: Date = new Date()): Post[] {
  return publishedPosts(now).filter(post => post.slug !== slug).slice(0, 2)
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
