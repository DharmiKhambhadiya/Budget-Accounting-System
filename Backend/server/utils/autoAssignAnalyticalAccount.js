import AutoAnalyticalModel from '../models/AutoAnalyticalModel.model.js';


/**
 * Automatically assign analytical account based on rules
 * @param {Object} data - Data to check against rules (vendorId, productId, amount, etc.)
 * @returns {ObjectId|null} - Analytical Account ID or null
 */
const autoAssignAnalyticalAccount = async (data) => {
  try {
    // Get all rules, sorted by priority (highest first)
    const rules = await AutoAnalyticalModel.find()
      .sort({ priority: -1 })
      .populate('analyticalAccountId');

    for (const rule of rules) {
      let matches = true;

      // Check vendor-based rule
      if (rule.ruleType === 'vendor_based' && rule.conditions.vendorId) {
        if (data.vendorId && data.vendorId.toString() === rule.conditions.vendorId.toString()) {
          return rule.analyticalAccountId._id;
        }
        matches = false;
      }

      // Check product-based rule
      if (rule.ruleType === 'product_based' && rule.conditions.productId) {
        if (data.items && data.items.some(item => 
          item.productId && item.productId.toString() === rule.conditions.productId.toString()
        )) {
          return rule.analyticalAccountId._id;
        }
        matches = false;
      }

      // Check amount-based rule
      if (rule.ruleType === 'amount_based') {
        const amount = data.totalAmount || data.amount || 0;
        if (rule.conditions.minAmount && amount < rule.conditions.minAmount) {
          matches = false;
        }
        if (rule.conditions.maxAmount && amount > rule.conditions.maxAmount) {
          matches = false;
        }
        if (matches) {
          return rule.analyticalAccountId._id;
        }
      }

      // Check custom/keyword-based rule
      if (rule.ruleType === 'custom' && rule.conditions.keywords && rule.conditions.keywords.length > 0) {
        const searchText = JSON.stringify(data).toLowerCase();
        const hasKeyword = rule.conditions.keywords.some(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
        if (hasKeyword) {
          return rule.analyticalAccountId._id;
        }
        matches = false;
      }
    }

    return null;
  } catch (error) {
    console.error('Error in auto-assigning analytical account:', error);
    return null;
  }
};

export default autoAssignAnalyticalAccount;
