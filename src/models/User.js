class User {
  constructor(data = {}) {
    // Map of class property: data property or function
    const map = {
      id: d => d.ID || '',
      firstName: d => d.first_name || '',
      lastName: d => d.last_name || '',
      name: d => (d.first_name && d.last_name) ? `${d.first_name} ${d.last_name}` : (d.fullName || 'User'),
      email: d => d.email || '',
      phoneNumber: d => d.phone_number || '',
      gender: d => d.gender || '',
      status: d => d.status || '',
      profileImage: d => d.profile_image || '',
      avatar: d => d.profile_image ? `/uploads/${d.profile_image}` : (d.avatar || '/icons/female.svg'),
      balance: d => d.balance || 0,
      totalCredit: d => d.total_credit || 0,
      amountRemaining: d => d.amountRemaining || 0,
      stage: d => d.stage || {},
      level: d => (d.stage && d.stage.name) ? d.stage.name.replace('Level ', '') : (d.level || 1),
      progress: d => typeof d.percentage === 'number' ? d.percentage : (d.progress || 0),
      nextStage: d => d.nextStage || '',
      isLastStage: d => !!d.isLastStage,
      discount: d => (d.stage && d.stage.discount) || '',
      discountType: d => (d.stage && d.stage.discount_type) || '',
      noOrder: d => (d.stage && d.stage.no_order) || '',
    };

    Object.keys(map).forEach(key => {
      this[key] = map[key](data);
    });

    this.fullData = data; // Keep original data for reference if needed
  }
}

export default User;
