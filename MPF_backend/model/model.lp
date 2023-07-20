\ Model MultiPeriodFarmingModel
\ LP format - for model browsing. Use MPS format to capture full model detail.
Maximize
  - 150.0069291684998 ProductionQty[XYX,1]
   - 550.0289265288166 ProductionQty[XYX,2]
   - 90.00553333333335 ProductionQty[tt,1] - 330.021 ProductionQty[tt,2]
   - 48 PurchaseQty[XYX,1] - 48 PurchaseQty[XYX,2] - 68 PurchaseQty[tt,1]
   - 68 PurchaseQty[tt,2] + 12 ShippingQty[XYX,1] + 12 ShippingQty[XYX,2]
   + 17 ShippingQty[tt,1] + 17 ShippingQty[tt,2] - InventoryQty[XYX,1]
   - 9 InventoryQty[XYX,2] - InventoryQty[tt,1] - 9 InventoryQty[tt,2]
Subject To
 InvBalanceConstraint: ShippingQty[XYX,1] + InventoryQty[XYX,1] = 0
 InvBalanceConstraint: ProductionQty[XYX,1] - ShippingQty[XYX,2]
   - 3 InventoryQty[XYX,1] - InventoryQty[XYX,2] = 0
 InvBalanceConstraint: ShippingQty[tt,1] + InventoryQty[tt,1] = 0
 InvBalanceConstraint: - ShippingQty[tt,2] - 7 InventoryQty[tt,1]
   - InventoryQty[tt,2] = 0
 ShippingConstraint: ShippingQty[XYX,1] = 0
 ShippingConstraint: ShippingQty[XYX,2] = 0
 ShippingConstraint: ShippingQty[tt,1] = 0
 ShippingConstraint: ShippingQty[tt,2] = 0
 ManHoursConstraint: 3.2996040475142987e-04 ProductionQty[XYX,1]
   + 4.6666666666666666e-04 ProductionQty[tt,1] <= 4
 ManHoursConstraint: 3.2996040475142987e-04 ProductionQty[XYX,2]
   + 4.6666666666666666e-04 ProductionQty[tt,2] <= 12
 WaterConstraint: 50 ProductionQty[XYX,1] + 30 ProductionQty[tt,1] <= 2
 WaterConstraint: 50 ProductionQty[XYX,2] + 30 ProductionQty[tt,2] <= 10
 LandConstraint_A: - 1.0998680158380995e-04 ProductionQty[XYX,1] + U[XYX,1]
   = 0
 LandConstraint_A: - 1.0998680158380995e-04 ProductionQty[XYX,2] + U[XYX,2]
   = 0
 LandConstraint_A: - 6.66667e-05 ProductionQty[tt,1] + U[tt,1] = 0
 LandConstraint_A: - 6.66667e-05 ProductionQty[tt,1]
   - 6.66667e-05 ProductionQty[tt,2] + U[tt,2] = 0
 LandConstraint_B: - U[XYX,1] - U[tt,1] + OCC[1] = 0
 LandConstraint_B: - U[XYX,2] - U[tt,2] + OCC[2] = 0
 LandConstraint_C: OCC[1] + V[1] = 10
 LandConstraint_C: OCC[1] + V[2] = 10
 BigM: ProductionQty[XYX,1] + [ - 9092 ProduceSelect[XYX,1] * V[1] ] <= 0
 BigM: ProductionQty[XYX,2] + [ - 9092 ProduceSelect[XYX,2] * V[2] ] <= 0
 BigM: ProductionQty[tt,1] + [ - 15000 ProduceSelect[tt,1] * V[1] ] <= 0
 BigM: ProductionQty[tt,2] + [ - 15000 ProduceSelect[tt,2] * V[2] ] <= 0
Bounds
Binaries
 ProduceSelect[XYX,1] ProduceSelect[XYX,2] ProduceSelect[tt,1]
 ProduceSelect[tt,2]
End
