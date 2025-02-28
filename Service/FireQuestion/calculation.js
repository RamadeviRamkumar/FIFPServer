function RetirementCalculation(data) {
  const {
    age,
    retireage,
    currentExpense,
    inflation,
    monthlysavings,
    retirementsavings,
    prereturn,
    postreturn,
    expectancy,
  } = data;

  const yearsToRetirement = retireage - age;
  const postRetirementYears = expectancy - retireage;
  const yearlyInvestment = monthlysavings * 12;

  // Adjusted future expense after inflation
  const adjustedExpense = Math.floor(
    currentExpense * Math.pow(1 + inflation / 100, yearsToRetirement)
  );

  // Target savings needed after retirement
  const targetSavings = adjustedExpense * 12 * postRetirementYears;

  // Growth of current savings until retirement
  const savingsAtRetirement =
    retirementsavings * Math.pow(1 + prereturn / 100, yearsToRetirement);

  function calculateYearlyCompoundingSavings(monthlysavings, prereturn, years) {
    return (
      (monthlysavings * 12 * ((1 + prereturn / 100) ** years - 1)) /
      (prereturn / 100)
    );
  }

  const accumulatedSavingsFromMonthly = Math.floor(
    calculateYearlyCompoundingSavings(
      monthlysavings,
      prereturn,
      yearsToRetirement
    )
  );

  // Total savings at retirement
  const totalSavingsAtRetirement =
    savingsAtRetirement + accumulatedSavingsFromMonthly;

  // Shortfall in savings
  const savingsShortfall = targetSavings - totalSavingsAtRetirement;

  // Extra one-time savings needed to reach target savings
  const extraOneTimeSavings = targetSavings - savingsAtRetirement;

  // Extra monthly savings required
  const monthlyRatePre = prereturn / 100 / 12;
  const monthsToRetirement = yearsToRetirement * 12;

  const extraMonthlySavings =
    extraOneTimeSavings > 0
      ? (extraOneTimeSavings * monthlyRatePre) /
        (Math.pow(1 + monthlyRatePre, monthsToRetirement) - 1)
      : 0;

  // Calculate annual step-up percentage for increasing savings yearly
  const requiredAdditionalSavings = targetSavings - savingsAtRetirement;

  const annualStepUpPercentage1 = calculateAnnualStepUp(
    requiredAdditionalSavings,
    monthlysavings,
    yearsToRetirement,
    monthlyRatePre
  );
  const annualStepUpPercentage = parseInt(annualStepUpPercentage1);
  function calculateAnnualStepUp(
    requiredSavings,
    monthlySavings,
    yearsToRetirement,
    monthlyRatePre
  ) {
    const monthsToRetirement = yearsToRetirement * 12;
    let low = 0,
      high = 100;
    const tolerance = 1e-5;

    while (high - low > tolerance) {
      const mid = (low + high) / 2;
      const annualStepUp = mid / 100;
      let futureValue = 0;
      let adjustedMonthlySavings = monthlySavings;

      for (let t = 1; t <= monthsToRetirement; t++) {
        // Increase savings each year
        if (t % 12 === 0) {
          adjustedMonthlySavings *= 1 + annualStepUp;
        }

        // Accumulate future value with interest
        futureValue +=
          adjustedMonthlySavings *
          Math.pow(1 + monthlyRatePre, monthsToRetirement - t);
      }

      // Binary search update
      if (futureValue < requiredSavings) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2;
  }

  // Retirement year calculation
  const current = new Date().getFullYear();
  const retirementYear = current + yearsToRetirement;
  const retirementDate = new Date();
  retirementDate.setFullYear(retirementYear);

  // Format the date to YYYY-MM-DD
  const formattedRetirementDate = retirementDate.toISOString().split("T")[0];

  // Correcting the return object (removing undefined variables)
  const results = {
    yearsLeftForRetirement: Math.round(yearsToRetirement),
    monthlyExpensesAfterRetirement: Math.round(adjustedExpense),
    targetedSavings: Math.round(targetSavings),
    totalSavingsAtRetirement: Math.round(totalSavingsAtRetirement),
    accumulatedSavings: Math.round(accumulatedSavingsFromMonthly),
    shortfallInSavings: Math.round(savingsShortfall),
    existingSavingsGrowth: Math.round(savingsAtRetirement),
    extraOneTimeSavingsRequired: Math.round(extraOneTimeSavings),
    extraMonthlySavingsRequired: Math.round(extraMonthlySavings),
    annualStepUpPercentage: Math.round(annualStepUpPercentage),
    yearlyInvestment: Math.round(yearlyInvestment),
    retirementDate: formattedRetirementDate,
  };
  // Investment Achievement plan Details - Create
  const investmentAchievementPlan = [];
  const startDate = new Date(data.startDate || new Date());
  const Year = startDate.getFullYear();
  const Month = startDate.getMonth() + 1;
  let initialReturnsRate = 0;
  let initialInvestmentAmount = 0;
  let initialinvestmentwithStepup = 0;
  let previousInvestedValue = monthlysavings * 12;
  let previousInvestmentValue = 0;
  let previousInvestmentValueSIP = 0;
  let previousInvestmentSIP = extraMonthlySavings * 12;
  let previousInvestmentwithstepup = 0;
  let yearlySIP = extraMonthlySavings * 12;

  for (let i = 0; i <= yearsToRetirement; i++) {
    const year = Year + i;
    const monthYear = `${Month.toString().padStart(2, "0")}/${year}`;
    //Investment without step-up
    const investmentAmount1 =
      i === 0 ? initialInvestmentAmount : monthlysavings * 12;
    const investmentAmount = parseInt(investmentAmount1);

    // Returns Rate without stepup
    const ReturnsRate1 =
      i === 0
        ? 0
        : i === 1
        ? Math.round((yearlyInvestment * prereturn) / 100)
        : Math.round((previousInvestedValue * prereturn) / 100);
    const ReturnsRate = parseInt(ReturnsRate1);
    //Investment Amount for monthly sip
    const InvestmentSIP1 = i === 0 ? initialReturnsRate : yearlySIP;
    const InvestmentSIP = parseInt(InvestmentSIP1);
    //returnsRate for monthly sip
    const Return =
      i === 0
        ? 0
        : i === 1
        ? Math.round((yearlySIP * prereturn) / 100)
        : Math.round((previousInvestmentValueSIP * prereturn) / 100);
    //Investment Amount with stepup
    const updatedMonthlySavings =
      i === 0
        ? 0
        : i === 1
        ? yearlyInvestment
        : yearlyInvestment * Math.pow(1 + annualStepUpPercentage / 100, i - 1);

    const investmentwithStepup1 = Math.round(updatedMonthlySavings);

    const investmentwithStepup = parseInt(investmentwithStepup1);
    // Calculate returns rate with step-up for the current year
    const ReturnsRatewithStepup1 =
      i === 0
        ? 0
        : i === 1
        ? (yearlyInvestment * prereturn) / 100
        : (previousInvestmentwithstepup * prereturn) / 100;
    const ReturnsRatewithStepup = parseInt(ReturnsRatewithStepup1);
    //calculate with step-up investment value
    const investedwithStepup1 =
      i === 0
        ? investmentwithStepup
        : investmentwithStepup +
          ReturnsRatewithStepup +
          previousInvestmentwithstepup;
    const investedwithStepup = parseInt(investedwithStepup1);
    // Calculate invested value without step-up
    const investedValue =
      i === 0
        ? investmentAmount
        : investmentAmount + ReturnsRate + previousInvestedValue;

    // calculate Invested value monthly sip
    const investmentvalueSIP =
      i === 0
        ? InvestmentSIP
        : InvestmentSIP + Return + previousInvestmentValueSIP;
    // Calculate lumpsum growth
    const lumpsum = Math.round(
      retirementsavings * Math.pow(1 + prereturn / 100, i)
    );

    // Calculate target achieve value
    const totalvalue = Math.round(investedValue + lumpsum);
    //calculate withstepup target achieve value
    const totalvaluewithStepup = Math.round(investedwithStepup + lumpsum);
    //calculate monthly SIP
    const totalvalueSIP = Math.round(investmentvalueSIP + lumpsum);
    // Check if the target is achieved
    const status = totalvalue >= previousInvestmentValue * yearsToRetirement;

    // Push the data for the current year
    investmentAchievementPlan.push({
      year: monthYear,
      investmentAmount,
      investmentwithStepup,
      InvestmentSIP,
      ReturnsRate,
      ReturnsRatewithStepup,
      Return,
      investmentValue: Math.round(investedValue),
      investmentValuewithStepup: investedwithStepup,
      investmentvalueSIP,
      lumpsum,
      // targetAchieve,
      totalvalue,
      totalvaluewithStepup,
      totalvalueSIP,
      status,
    });

    // Update previousInvestmentValue for the next iteration

    previousInvestedValue = investedValue;
    previousInvestmentValue = investmentAmount;
    previousInvestmentValueSIP = investmentvalueSIP;
    previousInvestmentwithstepup = investedwithStepup;
    previousInvestmentSIP = InvestmentSIP;
  }
  // Withdrawal Plan;
  const withdrawPlan = [];

  let remainingNetworth =
    investmentAchievementPlan[investmentAchievementPlan.length - 1].totalvalue;
  let remainingNetworthStepup =
    investmentAchievementPlan[investmentAchievementPlan.length - 1]
      .totalvaluewithStepup;
  let remainingNetworthSIP =
    investmentAchievementPlan[investmentAchievementPlan.length - 1]
      .totalvalueSIP;

  const annualExpenses = adjustedExpense * 12;
  const monthlyRatePost = postreturn / 100 / 12;
  let initialReturn = 0;
  let initialReturnstep = 0;
  let previousNetworth = remainingNetworth;
  let previousNetworthStepup = remainingNetworthStepup;
  let previousNetworthSIP = remainingNetworthSIP;
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < postRetirementYears; i++) {
    const year = currentYear + yearsToRetirement + i;
    const monthYear = `${Month.toString().padStart(2, "0")}/${year}`;
    const withdrawAmount = annualExpenses * Math.pow(1 + inflation / 100, i);

    // Set ReturnsRate to 0 for the first year
    const ReturnsRate =
      i === 0 ? 0 : Math.round((previousNetworth * postreturn) / 100);
    const ReturnSIP =
      i === 0 ? 0 : Math.round((previousNetworthSIP * postreturn) / 100);
    const ReturnsStepup =
      i === 0 ? 0 : Math.round((previousNetworthStepup * postreturn) / 100);

    // Calculate new net worth
    const networth =
      i === 0
        ? investmentAchievementPlan[investmentAchievementPlan.length - 1]
            .totalvalue
        : previousNetworth + ReturnsRate - withdrawAmount;

    const networthStepup =
      previousNetworthStepup + ReturnsStepup - withdrawAmount;
    const networthSIP = previousNetworthSIP + ReturnSIP - withdrawAmount;

    withdrawPlan.push({
      year: monthYear,
      withdrawal: Math.round(withdrawAmount),
      networth: Math.round(networth),
      ReturnsRate,
      ReturnsStepup,
      ReturnSIP,
      networthStepup: Math.round(networthStepup),
      networthSIP: Math.round(networthSIP),
      permonthexpenses: Math.round(withdrawAmount / 12),
    });

    // Update previous values for the next iteration
    previousNetworth = networth;
    previousNetworthStepup = networthStepup;
    previousNetworthSIP = networthSIP;
  }

  return {
    results,
    investmentAchievementPlan,
    withdrawPlan
  }
    
  
}

module.exports = RetirementCalculation;

  