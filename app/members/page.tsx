import Link from 'next/link'

const members = [
  { name: 'Marco', location: 'Uptown PS', dog: 'Biscuit', breed: 'French Bulldog', age: '3 yrs', joined: 'Jan 2023', emoji: '🐾', color: 'from-plum to-plum-light' },
  { name: 'Tyler', location: 'Palm Canyon', dog: 'Mango', breed: 'Golden Retriever', age: '2 yrs', joined: 'Mar 2023', emoji: '🌟', color: 'from-brand-orange to-brand-orange-light' },
  { name: 'Derek', location: 'Cathedral City', dog: 'Zeus', breed: 'Doberman', age: '5 yrs', joined: 'Jun 2022', emoji: '⚡', color: 'from-brand-teal to-brand-teal-light' },
  { name: 'James', location: 'Old Las Palmas', dog: 'Pretzel', breed: 'Dachshund', age: '7 yrs', joined: 'Feb 2021', emoji: '🥨', color: 'from-plum to-brand-teal' },
  { name: 'Chris', location: 'Movie Colony', dog: 'Noodle', breed: 'Labradoodle', age: '4 yrs', joined: 'Aug 2023', emoji: '🍜', color: 'from-brand-golden to-brand-orange' },
  { name: 'Ryan', location: 'South PS', dog: 'Taco', breed: 'Chihuahua Mix', age: '6 yrs', joined: 'Nov 2022', emoji: '🌮', color: 'from-brand-orange to-brand-orange-light' },
  { name: 'Matt', location: 'Rancho Mirage', dog: 'Duke', breed: 'German Shepherd', age: '3 yrs', joined: 'May 2023', emoji: '👑', color: 'from-plum to-plum-light' },
  { name: 'Alex', location: 'Desert Hot Springs', dog: 'Pepper', breed: 'Border Collie', age: '2 yrs', joined: 'Sep 2023', emoji: '🌶️', color: 'from-brand-teal to-brand-teal-light' },
  { name: 'Jordan', location: 'Palm Springs', dog: 'Waffle', breed: 'Corgi', age: '1 yr', joined: 'Jan 2024', emoji: '🧇', color: 'from-brand-golden to-brand-orange' },
  { name: 'Kevin', location: 'Indian Wells', dog: 'Bruno', breed: 'Bulldog', age: '4 yrs', joined: 'Apr 2022', emoji: '🏋️', color: 'from-plum to-brand-teal' },
  { name: 'Sam', location: 'Uptown PS', dog: 'Olive', breed: 'Italian Greyhound', age: '3 yrs', joined: 'Jul 2023', emoji: '🫒', color: 'from-brand-teal to-brand-teal-light' },
  { name: 'Will', location: 'Palm Canyon', dog: 'Beans', breed: 'Beagle', age: '5 yrs', joined: 'Dec 2021', emoji: '🫘', color: 'from-brand-orange to-brand-orange-light' },
]

export default function MembersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="section-title">Member Directory</h1>
          <p className="text-plum/60 mt-2">Meet the dog dads of Palm Springs — and their very good boys (and girls).</p>
        </div>
        <Link href="/members/join" className="btn-primary self-start">Join the Pack</Link>
      </div>

      {/* Search/Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 flex flex-col gap-3">
        <input
          type="text"
          placeholder="🔍  Search members or dog names..."
          className="w-full border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum placeholder-plum/40 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px]"
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <select className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white">
            <option>All Neighborhoods</option>
            <option>Uptown PS</option>
            <option>Palm Canyon</option>
            <option>Old Las Palmas</option>
            <option>Cathedral City</option>
            <option>Rancho Mirage</option>
          </select>
          <select className="flex-1 border border-plum/20 rounded-xl px-4 py-3 text-sm text-plum focus:outline-none focus:ring-2 focus:ring-brand-teal/30 min-h-[44px] bg-white">
            <option>All Breeds</option>
            <option>Small Dogs</option>
            <option>Medium Dogs</option>
            <option>Large Dogs</option>
          </select>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <div key={member.name} className="card hover:-translate-y-1 cursor-pointer group">
            {/* Avatar gradient */}
            <div className={`bg-gradient-to-br ${member.color} h-32 flex items-center justify-center text-6xl`}>
              {member.emoji}
            </div>
            <div className="p-4">
              <h3 className="font-extrabold text-plum text-lg">{member.name}</h3>
              <p className="text-xs text-plum/50 mb-3">📍 {member.location}</p>

              <div className="bg-brand-cream rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐶</span>
                  <div>
                    <div className="font-bold text-plum text-sm">{member.dog}</div>
                    <div className="text-xs text-plum/60">{member.breed} · {member.age}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-plum/40">Member since {member.joined}</span>
                <button className="text-xs font-bold text-brand-orange group-hover:underline">View Profile</button>
              </div>
            </div>
          </div>
        ))}

        {/* Join card */}
        <div className="card border-2 border-dashed border-plum/20 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
          <div className="w-16 h-16 bg-plum/10 rounded-full flex items-center justify-center text-3xl mb-4">🐾</div>
          <h3 className="font-extrabold text-plum text-lg mb-2">Be part of the pack</h3>
          <p className="text-plum/50 text-sm mb-5">Create your free member profile and introduce your dog to the community.</p>
          <Link href="/members/join" className="btn-primary text-sm">Join Free</Link>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-10">
        {[1, 2, 3, '...', 12].map((page, i) => (
          <button
            key={i}
            className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${
              page === 1 ? 'bg-plum text-white' : 'bg-white text-plum hover:bg-plum/10 shadow-sm'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  )
}
