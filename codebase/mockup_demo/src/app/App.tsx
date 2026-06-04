import { useState, useRef, useEffect } from 'react';
import { Search, Star, MapPin, Globe, Utensils, ChevronDown, DollarSign, Info } from 'lucide-react';

const foodPlaces = [
  {
    id: 1,
    name: "Chettinad Mansion",
    cuisine: "Tamil Nadu",
    location: "Chennai, India",
    country: "India",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1742281258189-3b933879867a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmb29kJTIwdGFtaWwlMjBjdWlzaW5lfGVufDF8fHx8MTc3NzQ4NDc1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Authentic Tamil Nadu Chettinad cuisine with rich spices",
    dishes: [
      { name: "Chettinad Chicken", price: "₹350", description: "Spicy chicken curry with aromatic Chettinad spices and coconut" },
      { name: "Chicken 65", price: "₹280", description: "Deep-fried spicy chicken appetizer, crispy and flavorful" },
      { name: "Mutton Kola Urundai", price: "₹400", description: "Spiced mutton meatballs in rich gravy" },
      { name: "Chettinad Fish Fry", price: "₹320", description: "Crispy fried fish marinated in South Indian spices" }
    ]
  },
  {
    id: 2,
    name: "Saravana Bhavan",
    cuisine: "Tamil Nadu",
    location: "Coimbatore, India",
    country: "India",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1742281257687-092746ad6021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBmb29kJTIwdGFtaWwlMjBjdWlzaW5lfGVufDF8fHx8MTc3NzQ4NDc1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Traditional South Indian vegetarian delicacies",
    dishes: [
      { name: "Masala Dosa", price: "₹120", description: "Crispy rice crepe filled with spiced potato masala" },
      { name: "Idli Sambar", price: "₹80", description: "Steamed rice cakes served with lentil soup and coconut chutney" },
      { name: "Pongal", price: "₹100", description: "Rice and lentil dish tempered with ghee, pepper, and cashews" },
      { name: "Filter Coffee", price: "₹40", description: "Strong South Indian filter coffee with frothy milk" }
    ]
  },
  {
    id: 3,
    name: "Madurai Kumar Mess",
    cuisine: "Tamil Nadu",
    location: "Madurai, India",
    country: "India",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1743615467363-250466982515?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxkb3NhJTIwaWRsaSUyMHNvdXRoJTIwaW5kaWFufGVufDF8fHx8MTc3NzQ4NDc1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Famous for Madurai-style non-veg specials",
    dishes: [
      { name: "Parotta with Chicken Salna", price: "₹180", description: "Flaky layered bread with spicy chicken curry" },
      { name: "Mutton Biryani", price: "₹280", description: "Fragrant rice cooked with tender mutton and aromatic spices" },
      { name: "Kari Dosa", price: "₹150", description: "Dosa stuffed with spicy mutton kheema" },
      { name: "Nattukoli Varuval", price: "₹350", description: "Country chicken dry fry with South Indian spices" }
    ]
  },
  {
    id: 4,
    name: "Amma's Kitchen",
    cuisine: "Tamil Nadu",
    location: "Trichy, India",
    country: "India",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1742281257707-0c7f7e5ca9c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBmb29kJTIwdGFtaWwlMjBjdWlzaW5lfGVufDF8fHx8MTc3NzQ4NDc1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Home-style Tamil meals served on banana leaf",
    dishes: [
      { name: "Banana Leaf Meals", price: "₹200", description: "Complete traditional Tamil meal with rice, sambar, rasam, and vegetables" },
      { name: "Curd Rice", price: "₹90", description: "Cooling rice mixed with yogurt, tempered with mustard seeds" },
      { name: "Vada", price: "₹60", description: "Crispy lentil fritters served with coconut chutney" },
      { name: "Payasam", price: "₹80", description: "Sweet dessert made with vermicelli, milk, and jaggery" }
    ]
  },
  {
    id: 5,
    name: "BBQ Smokehouse",
    cuisine: "American BBQ",
    location: "Texas, USA",
    country: "USA",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1550367363-ea12860cc124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3Nzc0NDE0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Slow-cooked ribs and brisket perfection",
    dishes: [
      { name: "Smoked Brisket", price: "$18", description: "14-hour smoked beef brisket, tender and juicy" },
      { name: "BBQ Ribs", price: "$22", description: "Fall-off-the-bone pork ribs with tangy BBQ sauce" },
      { name: "Pulled Pork", price: "$16", description: "Slow-smoked pulled pork shoulder with coleslaw" },
      { name: "Texas Sausage", price: "$14", description: "House-made beef sausage with jalapeño and cheese" }
    ]
  },
  {
    id: 6,
    name: "Burger Junction",
    cuisine: "American Diner",
    location: "Los Angeles, USA",
    country: "USA",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1502998070258-dc1338445ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3Nzc0NDE0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Gourmet burgers and hand-cut fries",
    dishes: [
      { name: "Classic Cheeseburger", price: "$12", description: "Angus beef patty with aged cheddar, lettuce, tomato" },
      { name: "Bacon Burger", price: "$15", description: "Double patty with crispy bacon and special sauce" },
      { name: "Veggie Burger", price: "$11", description: "House-made veggie patty with avocado and sprouts" },
      { name: "Loaded Fries", price: "$8", description: "Hand-cut fries topped with cheese, bacon, and jalapeños" }
    ]
  },
  {
    id: 7,
    name: "Southern Comfort Diner",
    cuisine: "American Soul Food",
    location: "New Orleans, USA",
    country: "USA",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3Nzc0NDE0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Classic Southern comfort food and soul cuisine",
    dishes: [
      { name: "Fried Chicken", price: "$16", description: "Crispy buttermilk fried chicken with mashed potatoes" },
      { name: "Shrimp & Grits", price: "$19", description: "Creamy grits topped with sautéed shrimp and Cajun sauce" },
      { name: "Mac & Cheese", price: "$10", description: "Creamy three-cheese macaroni baked to perfection" },
      { name: "Pecan Pie", price: "$7", description: "Traditional Southern pecan pie with vanilla ice cream" }
    ]
  },
  {
    id: 8,
    name: "Mumbai Spice",
    cuisine: "North Indian",
    location: "Mumbai, India",
    country: "India",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1694849789325-914b71ab4075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBmb29kJTIwdGFtaWwlMjBjdWlzaW5lfGVufDF8fHx8MTc3NzQ4NDc1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Rich North Indian curries and tandoor specialties",
    dishes: [
      { name: "Butter Chicken", price: "₹320", description: "Creamy tomato-based curry with tender chicken pieces" },
      { name: "Paneer Tikka", price: "₹280", description: "Grilled cottage cheese marinated in tandoori spices" },
      { name: "Naan Basket", price: "₹150", description: "Assorted Indian breads - butter, garlic, and plain naan" },
      { name: "Dal Makhani", price: "₹240", description: "Black lentils slow-cooked with butter and cream" }
    ]
  },
  {
    id: 9,
    name: "Sushi Zen",
    cuisine: "Japanese",
    location: "Tokyo, Japan",
    country: "Japan",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1700324828870-43027cba6d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzdXNoaSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3Nzc0ODQwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Traditional sushi crafted by master chefs",
    dishes: [
      { name: "Nigiri Set", price: "¥2800", description: "10-piece assorted nigiri sushi with fresh fish" },
      { name: "Sashimi Platter", price: "¥3200", description: "Premium selection of fresh raw fish slices" },
      { name: "Dragon Roll", price: "¥1800", description: "Eel and cucumber roll topped with avocado" },
      { name: "Miso Soup", price: "¥400", description: "Traditional fermented soybean soup with tofu" }
    ]
  },
  {
    id: 10,
    name: "Trattoria Romana",
    cuisine: "Italian",
    location: "Rome, Italy",
    country: "Italy",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1628169822580-ca53b886cdc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGFzdGElMjBwaXp6YXxlbnwxfHx8fDE3Nzc0ODQwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Authentic Italian pasta and wood-fired pizza",
    dishes: [
      { name: "Carbonara", price: "€14", description: "Classic Roman pasta with eggs, pecorino, and guanciale" },
      { name: "Margherita Pizza", price: "€12", description: "Wood-fired pizza with tomato, mozzarella, and basil" },
      { name: "Cacio e Pepe", price: "€13", description: "Simple yet divine pasta with cheese and black pepper" },
      { name: "Tiramisu", price: "€7", description: "Classic Italian dessert with coffee-soaked ladyfingers" }
    ]
  },
  {
    id: 11,
    name: "Tacos & Tequila",
    cuisine: "Mexican",
    location: "Mexico City, Mexico",
    country: "Mexico",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1688845465690-e5ea24774fd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjb3MlMjBmb29kfGVufDF8fHx8MTc3NzQzMDM5OHww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Street-style tacos and authentic Mexican flavors",
    dishes: [
      { name: "Tacos al Pastor", price: "$8", description: "Pork marinated with pineapple and Mexican spices" },
      { name: "Enchiladas Verdes", price: "$12", description: "Tortillas filled with chicken in green tomatillo sauce" },
      { name: "Quesadillas", price: "$10", description: "Grilled tortillas stuffed with cheese and your choice of filling" },
      { name: "Guacamole & Chips", price: "$ 7", description: "Fresh avocado dip with crispy tortilla chips" }
    ]
  },
  {
    id: 12,
    name: "Le Château",
    cuisine: "French",
    location: "Paris, France",
    country: "France",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxyZXN0YXVyYW50JTIwZm9vZHxlbnwxfHx8fDE3Nzc0NDE0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Elegant French cuisine in a sophisticated setting",
    dishes: [
      { name: "Coq au Vin", price: "€26", description: "Chicken braised in red wine with mushrooms and onions" },
      { name: "Beef Bourguignon", price: "€32", description: "Tender beef stew in Burgundy wine sauce" },
      { name: "Ratatouille", price: "€18", description: "Provençal vegetable stew with herbs" },
      { name: "Crème Brûlée", price: "€9", description: "Vanilla custard with caramelized sugar crust" }
    ]
  }
];

const orderHistory = [
  { orderId: '#ORD-001', restaurant: 'Chettinad Mansion', foods: ['Chettinad Chicken', 'Chicken 65'] },
  { orderId: '#ORD-002', restaurant: 'Saravana Bhavan', foods: ['Masala Dosa', 'Filter Coffee'] },
  { orderId: '#ORD-003', restaurant: 'BBQ Smokehouse', foods: ['Smoked Brisket', 'BBQ Ribs'] },
  { orderId: '#ORD-004', restaurant: 'Sushi Zen', foods: ['Nigiri Set', 'Dragon Roll'] },
  { orderId: '#ORD-005', restaurant: 'Trattoria Romana', foods: ['Carbonara', 'Tiramisu'] },
  { orderId: '#ORD-006', restaurant: 'Le Château', foods: ['Coq au Vin', 'Crème Brûlée'] },
  { orderId: '#ORD-007', restaurant: 'Tacos & Tequila', foods: ['Tacos al Pastor', 'Quesadillas'] },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [hoveredDish, setHoveredDish] = useState<{ placeId: number; dishName: string } | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<typeof foodPlaces[0] | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hi User A! 👋 I can help you track your orders or find new restaurants. What would you like to do?' },
    { from: 'user', text: 'Can you tell me the status of my last order?' },
    { from: 'bot', text: 'Your last order #ORD-007 from Tacos & Tequila (Tacos al Pastor, Quesadillas) was delivered successfully. Enjoy your meal! 🌮' },
    { from: 'user', text: 'Thanks! Any recommendations for Japanese food?' },
    { from: 'bot', text: 'Absolutely! Sushi Zen in Tokyo is rated 4.9 ⭐ — their Nigiri Set and Dragon Roll are must-tries!' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, showOrderHistory]);

  const cuisines = ['All', 'Tamil Nadu', 'North Indian', 'American BBQ', 'American Soul Food', 'American Diner', 'Japanese', 'Italian', 'Mexican', 'French'];

  const filteredPlaces = foodPlaces.filter(place => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.dishes.some(dish => dish.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCuisine = selectedCuisine === 'All' || place.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="size-full bg-gray-50 overflow-auto">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#E23744] p-2 rounded-lg">
                <Utensils className="size-6 text-white" />
              </div>
              <h1 className="text-3xl text-[#1C1C1C]" style={{ fontWeight: 600 }}>Foodie</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowOrderHistory(true)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-[#E23744] flex items-center justify-center overflow-hidden">
                  <span className="text-white text-xs" style={{ fontWeight: 600 }}>UA</span>
                </div>
                <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>User A</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, or dishes (e.g., dosa, idli, masala dosa, biryani, burger)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E23744] focus:ring-1 focus:ring-[#E23744] text-base"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Cuisine Filters */}
        <div className="mb-6">
          <h2 className="text-lg mb-3" style={{ fontWeight: 500 }}>Filter by Cuisine</h2>
          <div className="flex flex-wrap gap-3">
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCuisine === cuisine
                    ? 'bg-[#E23744] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#E23744]'
                }`}
                style={{ fontWeight: selectedCuisine === cuisine ? 500 : 400 }}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {filteredPlaces.length} {filteredPlaces.length === 1 ? 'restaurant' : 'restaurants'} found
          </p>
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div key={place.id} onClick={() => setSelectedPlace(place)} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
              <div className="relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
                  <Star className="size-4 fill-[#E23744] text-[#E23744]" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>{place.rating}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl mb-1.5" style={{ fontWeight: 600, color: '#1C1C1C' }}>
                  {place.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">{place.cuisine}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{place.country}</span>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                  <MapPin className="size-4 text-[#E23744] flex-shrink-0" />
                  <span>{place.location}</span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2">{place.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-sm">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="size-8 text-gray-400" />
              </div>
              <h3 className="text-xl mb-2" style={{ fontWeight: 600 }}>No restaurants found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
      {/* Restaurant Menu Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setSelectedPlace(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-48 object-cover" />
              <button
                onClick={() => setSelectedPlace(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow transition-colors"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg shadow">
                <Star className="size-4 fill-[#E23744] text-[#E23744]" />
                <span className="text-sm" style={{ fontWeight: 600 }}>{selectedPlace.rating}</span>
              </div>
            </div>
            <div className="px-6 py-5">
              <h2 className="text-2xl mb-1" style={{ fontWeight: 700, color: '#1C1C1C' }}>{selectedPlace.name}</h2>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-600">{selectedPlace.cuisine}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{selectedPlace.country}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                <MapPin className="size-4 text-[#E23744] flex-shrink-0" />
                <span>{selectedPlace.location}</span>
              </div>
              <p className="text-sm text-gray-500 mb-5">{selectedPlace.description}</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1" style={{ fontWeight: 500 }}>
                  <Utensils className="size-3" />
                  MENU ITEMS
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedPlace.dishes.map((dish, index) => {
                    const isHovered = hoveredDish?.placeId === selectedPlace.id && hoveredDish?.dishName === dish.name;
                    return (
                      <div
                        key={index}
                        className="relative"
                        onMouseEnter={() => setHoveredDish({ placeId: selectedPlace.id, dishName: dish.name })}
                        onMouseLeave={() => setHoveredDish(null)}
                      >
                        <div className="flex items-center justify-between bg-red-50 hover:bg-red-100 px-3 py-2.5 rounded-lg cursor-pointer transition-all">
                          <span className="text-sm text-[#E23744]" style={{ fontWeight: 500 }}>{dish.name}</span>
                          <span className="text-sm text-[#E23744]" style={{ fontWeight: 600 }}>{dish.price}</span>
                        </div>
                        {isHovered && (
                          <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl z-20">
                            <div className="flex items-start gap-2">
                              <Info className="size-3 mt-0.5 flex-shrink-0" />
                              <p className="leading-relaxed">{dish.description}</p>
                            </div>
                            <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E23744] flex items-center justify-center">
                  <span className="text-white text-sm" style={{ fontWeight: 600 }}>UA</span>
                </div>
                <div>
                  <h2 className="text-lg" style={{ fontWeight: 600, color: '#1C1C1C' }}>User A</h2>
                  <p className="text-xs text-gray-400">Order History</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderHistory(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Order Table */}
            <div className="overflow-auto flex-shrink-0 max-h-64 px-6 py-4">
              <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide border border-gray-200" style={{ fontWeight: 600 }}>Order ID</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide border border-gray-200" style={{ fontWeight: 600 }}>Restaurant</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wide border border-gray-200" style={{ fontWeight: 600 }}>Food</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order, i) => (
                    <tr key={order.orderId} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                      <td className="px-4 py-3 text-[#E23744] border border-gray-200" style={{ fontWeight: 500 }}>{order.orderId}</td>
                      <td className="px-4 py-3 text-gray-700 border border-gray-200">{order.restaurant}</td>
                      <td className="px-4 py-3 border border-gray-200">
                        <div className="flex flex-col gap-1">
                          {order.foods.map((food, fi) => (
                            <span key={fi} className="inline-flex items-center gap-1 text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E23744] flex-shrink-0"></span>
                              {food}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2 text-right">{orderHistory.length} orders total</p>
            </div>

          </div>
        </div>
      )}
      {/* Fixed Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {showChat && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#E23744]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Utensils className="size-3.5 text-white" />
                </div>
                <span className="text-white text-sm" style={{ fontWeight: 600 }}>Support Chat</span>
              </div>
              <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="overflow-y-auto px-4 py-3 space-y-3" style={{ maxHeight: '300px' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-[#E23744] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Utensils className="size-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.from === 'user'
                        ? 'bg-[#E23744] text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.from === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white" style={{ fontSize: '9px', fontWeight: 600 }}>UA</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="px-3 py-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setChatMessages(prev => [...prev, { from: 'user', text: chatInput.trim() }]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { from: 'bot', text: "Thanks for your message! Our support team will get back to you shortly." }]);
                    }, 600);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#E23744] focus:ring-1 focus:ring-[#E23744]"
              />
              <button
                onClick={() => {
                  if (chatInput.trim()) {
                    setChatMessages(prev => [...prev, { from: 'user', text: chatInput.trim() }]);
                    setChatInput('');
                    setTimeout(() => {
                      setChatMessages(prev => [...prev, { from: 'bot', text: "Thanks for your message! Our support team will get back to you shortly." }]);
                    }, 600);
                  }
                }}
                className="px-3 py-2 bg-[#E23744] text-white rounded-xl text-xs hover:bg-[#c9303c] transition-colors"
                style={{ fontWeight: 500 }}
              >
                Send
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowChat(prev => !prev)}
          className="w-12 h-12 rounded-full bg-[#E23744] shadow-lg flex items-center justify-center hover:bg-[#c9303c] transition-colors"
        >
          <Utensils className="size-5 text-white" />
        </button>
      </div>
    </div>
  );
}