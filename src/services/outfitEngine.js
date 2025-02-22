// A simple rule-based engine to generate weekly outfits.
// Assume each wardrobe item has: id, category ("top", "bottom", "footwear"), wearCount, laundryStatus, and properties.
export const generateWeeklyOutfits = (wardrobe, preferences = {}) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyOutfits = {};
  
    // Filter available items (not in laundry and wearCount > 0)
    const available = wardrobe.filter(item => !item.laundryStatus && item.wearCount > 0);
  
    // For simplicity, assume a basic outfit needs one "top" and one "bottom".
    const tops = available.filter(item => item.category === "top");
    const bottoms = available.filter(item => item.category === "bottom");
    // Optionally, include footwear if available.
    const footwear = available.filter(item => item.category === "footwear");
  
    days.forEach(day => {
      weeklyOutfits[day] = {
        top: tops.length > 0 ? tops[0] : null,
        bottom: bottoms.length > 0 ? bottoms[0] : null,
        footwear: footwear.length > 0 ? footwear[0] : null,
      };
    });
  
    return weeklyOutfits;
  };
  
  export const updateWardrobeAfterOutfits = (wardrobe, weeklyOutfits) => {
    // For each used item, decrement its wearCount.
    // If an item's wearCount reaches 0, mark it as in laundry.
    const usedIds = [];
    Object.values(weeklyOutfits).forEach(outfit => {
      ["top", "bottom", "footwear"].forEach(part => {
        if (outfit[part]) {
          usedIds.push(outfit[part].id);
        }
      });
    });
  
    return wardrobe.map(item => {
      if (usedIds.includes(item.id)) {
        const newCount = item.wearCount - 1;
        return {
          ...item,
          wearCount: newCount,
          laundryStatus: newCount <= 0,
        };
      }
      return item;
    });
  };
  