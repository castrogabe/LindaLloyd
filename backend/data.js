// http://localhost:8000/api/seed
// go to this link and it will load the data into the database

const bcrypt = require('bcryptjs');

const data = {
  users: [
    {
      name: 'Linda',
      email: 'lindalloydantantiques@gmail.com',
      password: bcrypt.hashSync('Linda1234'),
      isAdmin: true,
    },
    {
      name: 'Gabe',
      email: 'gabewebdevelopment@gmail.com',
      password: bcrypt.hashSync('Gabe1234'),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: 'Ceramic Jar',
      slug: 'ceramic-jar',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/1.png',
      images: ['/images/1.png', '/uploads/1a.png', '/uploads/1b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 10,
      from: 'Europe',
      rating: 5,
      numReviews: 1,
      condition: 'New',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Ceramic',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: true, // Assuming it has documentation
      description:
        'Handmade rustic clay pot with a wide mouth and a rounded body, showing signs of aging and use. The surface of the pot has a textured, weathered appearance with various shades of brown, indicating its age and possibly some hand-made elements. There are several horizontal ridges around the body.',
    },
    {
      name: 'Murano Glass Red Goblet',
      slug: 'murano-glass-red-goblet',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/2.png',
      images: ['/images/2.png', '/images/2a.png', '/images/2b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'Italy',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Glass',
      period: 'Contemporary', // Example period
      maker: 'Murano',
      provenance: false, // Assuming it has documentation
      description:
        'Made in Italy, The piece in the image is a delicate red glass bowl or goblet, with a clear, intricately detailed stem that resembles a fish or a mythical creature.',
    },
    {
      name: 'Delos Head Statue',
      slug: 'delos-head-statue',
      category: 'Accessories',
      categoryImage: '/uploads/categories/accessories.png',
      image: '/images/3.png',
      images: ['/images/3.png', '/images/3a.png', '/images/3b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'Greek Islands',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Bronze',
      period: 'Contemporary', // Example period
      maker: 'Murano',
      provenance: true, // Assuming it has documentation
      description:
        'Inspired by 5000-year-old Cycladic art from the Greek Islands, this exquisite piece demands attention with its majestic presence.',
    },
    {
      name: 'Woman Painting',
      slug: 'woman-painting',
      category: 'Wall',
      categoryImage: '/uploads/categories/wall.png',
      image: '/images/4.png',
      images: ['/images/4.png', '/images/4a.png', '/images/4b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'USA',
      dimensions: 'Height: 36in, Width: 24in', // Example dimensions
      materials: 'Oil on Canvas',
      period: 'Contemporary', // Example period
      maker: 'Renesgg Nukers',
      provenance: true, // Assuming it has documentation
      description:
        'Stunning and eye-catching, this large exquisite oil on canvas is a fantastic display of artistry, Inspired by the likes of Diego Rivera and Paul Gauguin, with hints of Van Gogh’s influence, this masterpiece bursts with vibrant colors and intricate details. The women adorned in colorful attire, alongside the lush depiction of vegetables, leaves, and fruit-laden trees, make this painting truly mesmerising.',
    },
    {
      name: 'Apollo Bust',
      slug: 'apollo-bust',
      category: 'Accessories',
      categoryImage: '/uploads/categories/accessories.png',
      image: '/images/5.png',
      images: ['/images/5.png', '/images/5a.png', '/images/5b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'Greece',
      dimensions: 'Height: 30in, Diameter: 16in', // Example dimensions
      materials: 'Marble',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description: 'Glorious God Apollo Bust, Ancient Greek Sculpture.',
    },
    {
      name: 'Murano Glass Bowl',
      slug: 'murano-glass-bowl',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/6.png',
      images: ['/images/6.png', '/images/6a.png', '/images/6b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'Italy',
      dimensions: 'Height: 3in, Diameter: 10in', // Example dimensions
      materials: 'Glass',
      period: 'Contemporary', // Example period
      maker: 'Murano',
      provenance: true, // Assuming it has documentation
      description:
        'This is a decorative glass bowl, likely a piece of art glass. It has a round, shallow design with a thick rim. The bowl features an intricate pattern of small raised dots evenly distributed on its interior and exterior surfaces, adding texture and visual interest. The glass itself has a slightly iridescent quality with a warm, amber hue, creating a shimmering effect as it catches the light.',
    },
    {
      name: 'Qwan Yin',
      slug: 'qwan-yin',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/7.png',
      images: ['/images/7.png', '/images/7a.png', '/images/7b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Good',
      from: 'India',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Wood',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Lights',
      slug: 'lights',
      category: 'Lighting',
      categoryImage: '/uploads/categories/lighting.png',
      image: '/images/8.png',
      images: ['/images/8.png', '/images/8a.png', '/images/8b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Great',
      from: 'Turkey',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Metal and Glass',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Painting',
      slug: 'painting',
      category: 'Wall',
      categoryImage: '/uploads/categories/wall.png',
      image: '/images/9.png',
      images: ['/images/9.png', '/images/9a.png', '/images/9b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Great',
      from: 'USA',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Oil on Canvas',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Vases',
      slug: 'vases',
      category: 'New Arrivals',
      categoryImage: '/uploads/categories/newArrivals.png',
      image: '/images/10.png',
      images: ['/images/10.png', '/images/10a.png', '/images/10b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 0,
      rating: 5,
      numReviews: 1,
      condition: 'Like New',
      from: 'Italy',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Ceramic',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: true, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Roman Carving',
      slug: 'roman-carving',
      category: 'Accessories',
      categoryImage: '/uploads/categories/accessories.png',
      image: '/images/11.png',
      images: ['/images/11.png', '/images/11a.png', '/images/11b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Good',
      from: 'Italy',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Stone',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Stone Bowl',
      slug: 'stone-bowl',
      category: 'New Arrivals',
      categoryImage: '/uploads/categories/newArrivals.png',
      image: '/images/12.png',
      images: ['/images/12.png', '/images/12a.png', '/images/12b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Good',
      from: 'Greece',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Stone',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: true, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Ceramic Deer Vase',
      slug: 'ceramic-deer-vase',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/13.png',
      images: ['/images/13.png', '/images/13a.png', '/images/13b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 2,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'Italy',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Ceramic',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: true, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Blue Ceramic',
      slug: 'blue-ceramic',
      category: 'Accessories',
      categoryImage: '/uploads/categories/accessories.png',
      image: '/images/14.png',
      images: ['/images/14.png', '/images/14a.png', '/images/14b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'USA',
      dimensions: 'Height: 9in, Diameter: 4in', // Example dimensions
      materials: 'Ceramic',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: true, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Wire Wall Piece',
      slug: 'wire-wall-piece',
      category: 'Wall',
      categoryImage: '/uploads/categories/wall.png',
      image: '/images/15.png',
      images: ['/images/15.png', '/images/15a.png', '/images/15b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'USA',
      dimensions: 'Height: 30in, Width: 40in', // Example dimensions
      materials: 'Wire',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: true, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Cabinets',
      slug: 'cabinets',
      category: 'Furniture',
      categoryImage: '/uploads/categories/furniture.png',
      image: '/images/16.png',
      images: ['/images/16.png', '/images/16a.png', '/images/16b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Great',
      from: 'Italy',
      dimensions: 'Height: 40in, Diameter: 24in', // Example dimensions
      materials: 'Wood',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Greek Key Pot',
      slug: 'greek-key-pot',
      category: 'New Arrivals',
      categoryImage: '/uploads/categories/newArrivals.png',
      image: '/images/17.png',
      images: ['/images/17.png', '/images/17a.png', '/images/17b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'USA',
      dimensions: 'Height: 16in, Diameter: 10in', // Example dimensions
      materials: 'Concrete',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Foo Dog',
      slug: 'foo-dog',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/18.png',
      images: ['/images/18.png', '/images/18a.png', '/images/18b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'China',
      dimensions: 'Height: 6in, Diameter: 4in', // Example dimensions
      materials: 'Ceramic',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Wood Vase',
      slug: 'wood-vase',
      category: 'Table Top',
      categoryImage: '/uploads/categories/tableTop.png',
      image: '/images/19.png',
      images: ['/images/19.png', '/images/19a.png', '/images/19b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'Good',
      from: 'USA',
      dimensions: 'Height: 10in, Diameter: 15in', // Example dimensions
      materials: 'Segmented Wood',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
    {
      name: 'Copper Pot',
      slug: 'copper-pot',
      category: 'Accessories',
      categoryImage: '/uploads/categories/accessories.png',
      image: '/images/20.png',
      images: ['/images/20.png', '/images/20a.png', '/images/20b.png'], // Add additional images if available
      price: 50,
      salePrice: null,
      countInStock: 5,
      rating: 5,
      numReviews: 1,
      condition: 'New',
      from: 'USA',
      dimensions: 'Height: 12in, Diameter: 8in', // Example dimensions
      materials: 'Copper',
      period: 'Contemporary', // Example period
      maker: 'Unknown',
      provenance: false, // Assuming it has documentation
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
  ],
};

module.exports = data;
