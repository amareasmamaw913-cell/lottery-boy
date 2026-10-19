import { StoryPack } from '../types/storyboard';

export const STORY_PACKS: StoryPack[] = [
  {
    id: 'morning_commute',
    title: 'The Morning Commute Chaos',
    genre: 'Slapstick Comedy',
    description: 'The complete 30-scene saga of a stickman rushing to an essential 9:00 AM presentation.',
    scenes: [
      {
        title: 'Running Late Panic',
        prompt: 'Minimalist stickman running late, line art, white background',
        actionType: 'running_late',
        customDetails: { expression: 'panic', hasSpeedLines: true, prop: 'clock' }
      },
      {
        title: 'Tripping Over a Rock',
        prompt: 'Minimalist stickman tripping over a rock, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'shock', hasSpeedLines: true, prop: 'rock' }
      },
      {
        title: 'Mid-Air Freefall',
        prompt: 'Minimalist stickman tumbling mid-air horizontal flight, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'shock', hasSpeedLines: true }
      },
      {
        title: 'Briefcase Launch',
        prompt: 'Minimalist stickman briefcase bursting open with papers flying in wind, line art, white background',
        actionType: 'briefcase_flying',
        customDetails: { expression: 'panic', prop: 'briefcase' }
      },
      {
        title: 'Faceplant on Pavement',
        prompt: 'Minimalist stickman faceplant skid on asphalt floor, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Checking Wristwatch',
        prompt: 'Minimalist stickman staring wide-eyed at giant ticking wristwatch, line art, white background',
        actionType: 'looking_clock',
        customDetails: { expression: 'panic', prop: 'clock' }
      },
      {
        title: 'Scrambling for Papers',
        prompt: 'Minimalist stickman crawling frantically picking up loose document pages, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Coffee Cup Catastrophe',
        prompt: 'Minimalist stickman colliding into trashcan coffee cup splashing everywhere, line art, white background',
        actionType: 'coffee_spill',
        customDetails: { expression: 'shock', prop: 'coffee' }
      },
      {
        title: 'Soaked but Determined',
        prompt: 'Minimalist stickman dripping wet standing upright shaking fist forward, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Sprint with Turbo Dust',
        prompt: 'Minimalist stickman supersonic sprint legs spinning in circular blur, line art, white background',
        actionType: 'running_late',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      },
      {
        title: 'The Fleeing City Bus',
        prompt: 'Minimalist stickman chasing receding rear exhaust of city bus, line art, white background',
        actionType: 'bus_chase',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Grabbing Bumper Fingertips',
        prompt: 'Minimalist stickman stretching desperate arms reaching for bus tailgate bumper, line art, white background',
        actionType: 'bus_chase',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Bus Doors Slam Shut',
        prompt: 'Minimalist stickman hitting glass folding bus doors flat pressed, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Borrowing a Kid Bicycle',
        prompt: 'Minimalist stickman pedaling furiously on tiny child bicycle with bell, line art, white background',
        actionType: 'bicycle_ride',
        customDetails: { expression: 'determined', prop: 'bicycle' }
      },
      {
        title: 'Wobbly Wheel Wobble',
        prompt: 'Minimalist stickman swerving zig-zag wobbling on mini bicycle, line art, white background',
        actionType: 'bicycle_ride',
        customDetails: { expression: 'panic', prop: 'bicycle' }
      },
      {
        title: 'Cat Crossing Shortcut',
        prompt: 'Minimalist stickman swerving hard to dodge sleepy cat sitting on sidewalk, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Bicycle Chain Snap',
        prompt: 'Minimalist stickman holding broken bicycle chain staring bewildered, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'neutral' }
      },
      {
        title: 'Sudden Dark Cloud Rain',
        prompt: 'Minimalist stickman isolated under single pouring black rain cloud, line art, white background',
        actionType: 'rain_umbrella',
        customDetails: { expression: 'neutral', prop: 'umbrella' }
      },
      {
        title: 'Inside-Out Umbrella',
        prompt: 'Minimalist stickman holding umbrella blown inside-out like metal spider, line art, white background',
        actionType: 'rain_umbrella',
        customDetails: { expression: 'shock', prop: 'umbrella' }
      },
      {
        title: 'Sliding Down Handrail',
        prompt: 'Minimalist stickman grinding down long concrete staircase handrail, line art, white background',
        actionType: 'sliding',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      },
      {
        title: 'Spinning Revolving Door',
        prompt: 'Minimalist stickman trapped inside endlessly whirling glass revolving door, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Lobby Banana Peel',
        prompt: 'Minimalist stickman slipping backward on yellow banana peel in polished marble lobby, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'shock', prop: 'banana' }
      },
      {
        title: 'Elevator Closing Gap',
        prompt: 'Minimalist stickman diving forward fingers reaching for closing elevator gap, line art, white background',
        actionType: 'jumping',
        customDetails: { expression: 'panic', hasSpeedLines: true }
      },
      {
        title: 'Briefcase Jams Elevator',
        prompt: 'Minimalist stickman briefcase jammed sideways stopping closing elevator doors, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'shock', prop: 'briefcase' }
      },
      {
        title: 'Squeezing In Breathless',
        prompt: 'Minimalist stickman squeezed tightly between elevator occupants like sardine, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Floor 50 Ding',
        prompt: 'Minimalist stickman tumbling out into executive boardroom corridor, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Smoothing the Tie',
        prompt: 'Minimalist stickman straightening necktie taking deep breath outside boardroom, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Kicking Door Open Grandly',
        prompt: 'Minimalist stickman kicking open double conference doors like action hero, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      },
      {
        title: 'Clock Strikes 8:59 AM',
        prompt: 'Minimalist stickman pointing triumphantly at digital wall clock reading 8:59, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy', prop: 'clock' }
      },
      {
        title: 'CEO Standing Ovation',
        prompt: 'Minimalist stickman bowing gracefully receiving triumphant standing ovation, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      }
    ]
  },
  {
    id: 'superhero_training',
    title: 'Stickman Superhero Training',
    genre: 'Comic Action',
    description: 'A 30-scene origin story of an ordinary stick figure trying to become a caped superhero.',
    scenes: [
      {
        title: 'Sewing Red Cape',
        prompt: 'Minimalist stickman stitching red bedsheet cape at sewing table, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Testing Hero Pose',
        prompt: 'Minimalist stickman standing tall hands on hips chin up hero stance, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Cape in Fan Wind',
        prompt: 'Minimalist stickman cape flapping behind desk electric fan, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Trampoline Launch',
        prompt: 'Minimalist stickman jumping high off round backyard trampoline, line art, white background',
        actionType: 'jumping',
        customDetails: { expression: 'happy', hasSpeedLines: true }
      },
      {
        title: 'Rooftop Leap of Faith',
        prompt: 'Minimalist stickman leaping boldly off brick garage roof, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      },
      {
        title: 'Gravity Reminder',
        prompt: 'Minimalist stickman suspended mid-air realizing he cannot fly, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Bush Cushion Landing',
        prompt: 'Minimalist stickman landing headfirst inside dense garden hedge, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Cardboard Armor Upgrade',
        prompt: 'Minimalist stickman wearing taped cardboard box armor helmet, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Lifting Tiny Dumbbells',
        prompt: 'Minimalist stickman straining to benchpress tiny toy dumbbells, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Protein Smoothie Chug',
        prompt: 'Minimalist stickman chugging giant green vegetable smoothie jar, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Laser Pointer Reflexes',
        prompt: 'Minimalist stickman dodging erratic red laser pointer dots on wall, line art, white background',
        actionType: 'sliding',
        customDetails: { expression: 'panic', hasSpeedLines: true }
      },
      {
        title: 'Firecracker Rocket Rollerblades',
        prompt: 'Minimalist stickman strapping sparkler fireworks to rollerblade heels, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Rocket Rollerblade Blastoff',
        prompt: 'Minimalist stickman zooming at high velocity sparks flying out behind skates, line art, white background',
        actionType: 'running_late',
        customDetails: { expression: 'shock', hasSpeedLines: true }
      },
      {
        title: 'Haystack Crash Braking',
        prompt: 'Minimalist stickman plowing into tall barn haystack feet sticking out, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Whistle for Sidekick Dog',
        prompt: 'Minimalist stickman blowing silver dog whistle calling companion puppy, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Tiny Puppy Tackle',
        prompt: 'Minimalist stickman bowled over by energetic tiny puppy licking face, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Kitten Stuck in High Tree',
        prompt: 'Minimalist stickman looking up at frightened kitten on high oak branch, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Climbing the Tree Trunk',
        prompt: 'Minimalist stickman hugging tree trunk inching upward carefully, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Branch Snaps',
        prompt: 'Minimalist stickman clinging upside down as tree branch bends, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Kitten Jumps onto Hero Head',
        prompt: 'Minimalist stickman balancing cute kitten curled peacefully on his round head, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Ladder Hero Rescue',
        prompt: 'Minimalist stickman rescued from tree by neighborhood gardener ladder, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'neutral' }
      },
      {
        title: 'Bank Robber Spotted',
        prompt: 'Minimalist stickman hiding behind mailbox pointing at shadowy thief with sack, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Throwing Boomerang Banana',
        prompt: 'Minimalist stickman hurling yellow banana like precision tactical boomerang, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined', prop: 'banana' }
      },
      {
        title: 'Thief Slips and Falls',
        prompt: 'Minimalist stickman watching burglar cartoonishly slip on tossed banana peel, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'happy', prop: 'banana' }
      },
      {
        title: 'Wrapping Thief in Sticky Tape',
        prompt: 'Minimalist stickman wrapping criminal completely in shiny packing tape mummy, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Police Chief Handshake',
        prompt: 'Minimalist stickman shaking hand of grateful police chief giving gold medal, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Front Page Newspaper Headline',
        prompt: 'Minimalist stickman holding front page newspaper featuring his heroic portrait, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'City Sunset Vigil',
        prompt: 'Minimalist stickman perched atop gargoyle watching glowing city skyline, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Hero Signal in Clouds',
        prompt: 'Minimalist stickman looking at round stickman searchlight symbol projected on clouds, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Leaping into the Night',
        prompt: 'Minimalist stickman soaring across midnight sky full moon silhouette, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      }
    ]
  },
  {
    id: 'midnight_cookie_heist',
    title: 'The Midnight Cookie Heist',
    genre: 'Spy Comedy',
    description: 'An elite stickman secret operative sneaks downstairs past security to steal grandmother’s chocolate cookies.',
    scenes: [
      {
        title: 'Bedtime Alarm 02:00 AM',
        prompt: 'Minimalist stickman waking up at 2 AM wearing black ski mask, line art, white background',
        actionType: 'looking_clock',
        customDetails: { expression: 'determined', prop: 'clock' }
      },
      {
        title: 'Blueprints of the Kitchen',
        prompt: 'Minimalist stickman examining architectural blueprint map of kitchen counter, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'neutral' }
      },
      {
        title: 'Creaking Hallway Floorboards',
        prompt: 'Minimalist stickman tiptoeing on tiptoes holding breath over squeaky floor, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Sleeping Dog Obstacle',
        prompt: 'Minimalist stickman stepping delicately over sleeping bulldog on rug, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Dog Tail Wags Dangerously',
        prompt: 'Minimalist stickman freezing motionless as dog tail thumps the wood floor, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Grappling Hook to Stairs',
        prompt: 'Minimalist stickman firing plunger suction grappling hook at stair railing, line art, white background',
        actionType: 'jumping',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Zipline Down Banister',
        prompt: 'Minimalist stickman sliding silently down curved stair banister wire, line art, white background',
        actionType: 'sliding',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      },
      {
        title: 'Kitchen Motion Sensor Light',
        prompt: 'Minimalist stickman diving sideways into shadow as refrigerator light flickers, line art, white background',
        actionType: 'sliding',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Laser Tripwire Grid',
        prompt: 'Minimalist stickman putting on night vision goggles seeing glowing red laser beams, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Limbo Under Laser Beam',
        prompt: 'Minimalist stickman contorting back bending limbo style under glowing beam, line art, white background',
        actionType: 'sliding',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Cartwheel Past Second Laser',
        prompt: 'Minimalist stickman doing acrobat cartwheel between crossing laser diagonals, line art, white background',
        actionType: 'jumping',
        customDetails: { expression: 'happy', hasSpeedLines: true }
      },
      {
        title: 'Slippery Fresh Mop Floor',
        prompt: 'Minimalist stickman hydroplaning on wet kitchen linoleum floor, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Countertop Stool Stacking',
        prompt: 'Minimalist stickman stacking three wobbly bar stools toward top cabinet, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'High Altitude Climbing',
        prompt: 'Minimalist stickman scaling stack of wooden stools like mountain climber, line art, white background',
        actionType: 'jumping',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'The Golden Cookie Jar',
        prompt: 'Minimalist stickman eyes sparkling seeing ceramic cookie jar on high shelf, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Lifting the Ceramic Lid',
        prompt: 'Minimalist stickman lifting ceramic lid gingerly with micro-suction pads, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Fresh Cookie Aroma Cloud',
        prompt: 'Minimalist stickman floating in delicious chocolate chip vapor waves, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Stool Leg Snaps',
        prompt: 'Minimalist stickman wobbling violently as stool leg splinters beneath him, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Mid-Air Cookie Catch',
        prompt: 'Minimalist stickman falling backward catching three giant cookies in teeth and hands, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Soft Laundry Basket Landing',
        prompt: 'Minimalist stickman landing smack in basket of folded warm towels, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Cat Watches in Judgement',
        prompt: 'Minimalist stickman making shushing finger gesture to unimpressed house cat, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'neutral' }
      },
      {
        title: 'Cat Bribe with Milk Drop',
        prompt: 'Minimalist stickman sliding saucer of cream toward observant cat, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Floorboard Squeak Alert',
        prompt: 'Minimalist stickman freezing as footsteps thud upstairs on bedroom ceiling, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Emergency Cardboard Box Camouflage',
        prompt: 'Minimalist stickman crouching hidden under cardboard box with eye holes, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'neutral' }
      },
      {
        title: 'Grandmother Pours Water',
        prompt: 'Minimalist stickman peeking from box as grandmother sips glass in dim light, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Grandmother Returns Upstairs',
        prompt: 'Minimalist stickman sighing huge cloud of relief as door closes upstairs, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Tiptoeing Back to Base',
        prompt: 'Minimalist stickman stealthily crawling under blankets back into bedroom, line art, white background',
        actionType: 'sliding',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Flashlight Under Blanket',
        prompt: 'Minimalist stickman sitting cross-legged under tent blanket with flashlight, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'The First Glorious Bite',
        prompt: 'Minimalist stickman taking euphoric crunchy bite of warm chocolate cookie, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Mission Accomplished Sleep',
        prompt: 'Minimalist stickman sleeping blissfully with cookie crumbs on cheek, line art, white background',
        actionType: 'sleeping',
        customDetails: { expression: 'happy' }
      }
    ]
  },
  {
    id: 'fitness_revolution',
    title: 'Stickman Fitness Revolution',
    genre: 'Workout Comedy',
    description: '30 hilarious scenes of a determined stick figure attempting a 30-day transformation at the local gym.',
    scenes: [
      {
        title: 'New Year Resolution Oath',
        prompt: 'Minimalist stickman writing I WILL GET BUFF on bathroom mirror in steam, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Neon Headband and Wristbands',
        prompt: 'Minimalist stickman snapping elastic sweatband onto forehead ready for battle, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Treadmill Level 1 Walking',
        prompt: 'Minimalist stickman walking casually on slow moving rubber treadmill belt, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Accidental Turbo Button Hit',
        prompt: 'Minimalist stickman accidentally mashing SPEED 20 turbo button on treadmill, line art, white background',
        actionType: 'looking_clock',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Treadmill Speed Blur Legs',
        prompt: 'Minimalist stickman legs spinning like turbine engine desperately holding handlebars, line art, white background',
        actionType: 'running_late',
        customDetails: { expression: 'panic', hasSpeedLines: true }
      },
      {
        title: 'Launched into Foam Pit',
        prompt: 'Minimalist stickman shot backwards like cannonball flying off treadmill track, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'shock', hasSpeedLines: true }
      },
      {
        title: 'The 1-Pound Pink Dumbbell',
        prompt: 'Minimalist stickman straining with veins bulging lifting tiny 1kg pink dumbbell, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Bodybuilder Shadow Shaming',
        prompt: 'Minimalist stickman dwarfed by massive giant bodybuilder silhouette lifting car, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'neutral' }
      },
      {
        title: 'Drinking from Giant Gallon Jug',
        prompt: 'Minimalist stickman holding water jug bigger than his entire stick torso, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Jump Rope Foot Tangle',
        prompt: 'Minimalist stickman hogtied in braided jump rope tumbling over, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Kettlebell Swing Launch',
        prompt: 'Minimalist stickman dragged through the air holding heavy swinging cast iron kettlebell, line art, white background',
        actionType: 'superhero_fly',
        customDetails: { expression: 'shock', hasSpeedLines: true }
      },
      {
        title: 'Pretzel Yoga Disaster',
        prompt: 'Minimalist stickman tied into impossible pretzel knot on purple yoga mat, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Yoga Instructor Serenity',
        prompt: 'Minimalist stickman groaning on floor while instructor smiles peacefully in lotus pose, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Protein Shaker Lid Failure',
        prompt: 'Minimalist stickman vigorously shaking protein bottle lid pops explosion all over face, line art, white background',
        actionType: 'coffee_spill',
        customDetails: { expression: 'shock', prop: 'coffee' }
      },
      {
        title: 'Day 2 Whole Body Soreness',
        prompt: 'Minimalist stickman crawling like snail out of bed unable to bend wooden limbs, line art, white background',
        actionType: 'falling',
        customDetails: { expression: 'dizzy' }
      },
      {
        title: 'Stairs Look Like Everest',
        prompt: 'Minimalist stickman trembling at base of three subway stairs looking up in dread, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Eating Cold Chicken Breast',
        prompt: 'Minimalist stickman chewing dry unseasoned chicken breast with tears streaming, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Secret Donut Temptation',
        prompt: 'Minimalist stickman staring through bakery window at glowing glazed sprinkle donut, line art, white background',
        actionType: 'thinking',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Slapping Cheek for Discipline',
        prompt: 'Minimalist stickman slapping own stick face turning back to the iron weights, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Day 10 Punching Heavy Bag',
        prompt: 'Minimalist stickman delivering crisp boxing jab into heavy leather punching bag, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined', hasSpeedLines: true }
      },
      {
        title: 'Bag Bounces Back and Knocks Down',
        prompt: 'Minimalist stickman getting bopped backwards on return swing of heavy punching bag, line art, white background',
        actionType: 'tripping',
        customDetails: { expression: 'shock' }
      },
      {
        title: 'Getting Back Up Immediately',
        prompt: 'Minimalist stickman springing right back up fist raised with fiery eyes, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'First Pullup Ever',
        prompt: 'Minimalist stickman chin clearing the high steel pullup bar chin trembling, line art, white background',
        actionType: 'jumping',
        customDetails: { expression: 'panic' }
      },
      {
        title: 'Victory Hanging Roar',
        prompt: 'Minimalist stickman shouting in triumph hanging with one hand from high bar, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Day 20 Jogging with Dog',
        prompt: 'Minimalist stickman pacing smoothly at sunrise jogging alongside happy pup, line art, white background',
        actionType: 'running_late',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Benchpress Proper Rep',
        prompt: 'Minimalist stickman pressing clean barbell with two circular bumper plates, line art, white background',
        actionType: 'generic',
        customDetails: { expression: 'determined' }
      },
      {
        title: 'Day 30 Mirror Flex',
        prompt: 'Minimalist stickman flexing tiny defined cartoon bicep in mirror beaming with pride, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Running 5K Finish Line',
        prompt: 'Minimalist stickman breaking through paper ribbon finish line at marathon race, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy', hasSpeedLines: true }
      },
      {
        title: 'Wearing Gold Finisher Medal',
        prompt: 'Minimalist stickman biting shiny golden ribbon medal around neck smiling wide, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      },
      {
        title: 'Rewarding with One Perfect Donut',
        prompt: 'Minimalist stickman savoring one single delicious pink sprinkle donut in pure bliss, line art, white background',
        actionType: 'celebrating',
        customDetails: { expression: 'happy' }
      }
    ]
  }
];
