import timeit
import json
import fastapi
import gurobipy as gp
import pandas as pd
import xlrd
from fastapi import Depends, HTTPException
from fastapi.responses import JSONResponse
from gurobipy import GRB
from sqlalchemy.orm import Session

from app.db.db_setup import get_db
from app.db.models.general_info import GeneralInfo, PrimaryKey
from app.db.models.period_info import PeriodInfo
from app.db.models.produce_info import ProduceInfo
from app.db.models.produce_period_info import ProducePeriodInfo

router = fastapi.APIRouter()


@router.get(
    "/optimize",
    tags=["Multi Period Farming Optimization"],
)
async def optimize(id: int = None, db: Session = Depends(get_db)):
    start = timeit.default_timer()
    if id is not None:
        latest_id = id
        latest_primary_record = db.query(PrimaryKey).filter(PrimaryKey.id == id).first()
    else:
        latest_primary_record = (
            db.query(PrimaryKey).order_by(PrimaryKey.id.desc()).first()
        )
        latest_id = latest_primary_record.id
    LandAvailable = latest_primary_record.total_land_area_available

    general_info = (
        db.query(GeneralInfo).filter(GeneralInfo.primary_key_id == latest_id)
    ).all()
    produce_info = (
        db.query(ProduceInfo).filter(ProduceInfo.primary_key_id == latest_id).all()
    )
    produce_period_info = (
        db.query(ProducePeriodInfo)
        .filter(ProducePeriodInfo.primary_key_id == latest_id)
        .first()
    )
    period_info = (
        db.query(PeriodInfo).filter(PeriodInfo.primary_key_id == latest_id).all()
    )
    general_info_records = [result.__dict__ for result in general_info]
    produce_info_records = [result.__dict__ for result in produce_info]
    period_info_records = [result.__dict__ for result in period_info]

    # Load the workbook, and map sheets to variables
    dataset = produce_period_info.produce_period_file
    datafile = xlrd.open_workbook(dataset)
    GeneralInfoSheet = pd.DataFrame(general_info_records)
    ProduceSheet = pd.DataFrame(produce_info_records)

    ProducePeriodSheet = datafile.sheet_by_name(datafile.sheet_names()[0])
    PeriodSheet = pd.DataFrame(period_info_records)

    print("geberal", GeneralInfoSheet)
    # Sets
    produce = []

    nbProduce = len(general_info)
    nbPeriods = latest_primary_record.time_periods
    periods = [i for i in range(1, nbPeriods + 1)]

    i = 0
    while i < nbProduce:
        try:
            producevalue = GeneralInfoSheet.loc[i, "produce"].strip()
            produce.append(producevalue)
            i = i + 1
        except IndexError:
            break

    # ProduceSheet Variables
    harvestleadtime = {}
    i = 0
    for x in produce:
        harvestleadtime[x] = int(ProduceSheet.loc[i, "time_to_harvest"])
        i = i + 1

    purchaseleadtime = {}
    i = 0
    for x in produce:
        purchaseleadtime[x] = int(ProduceSheet.loc[i, "lead_time_to_purchase"])
        i = i + 1

    manhoursreqperacre = {}
    i = 0
    for x in produce:
        manhoursreqperacre[x] = ProduceSheet.loc[i, "man_hours_required_per_acre"]
        i = i + 1

    fractionlost = {}
    i = 0
    for x in produce:
        fractionlost[x] = ProduceSheet.loc[i, "fraction_lost_per_period"]
        i = i + 1

    # PeriodSheet Variables
    invholdingcost = {}
    i = 0
    for x in periods:
        invholdingcost[x] = PeriodSheet.loc[i, "inventory_holding_cost"]
        i = i + 1

    wateravailable = {}
    i = 0
    for x in periods:
        wateravailable[x] = PeriodSheet.loc[i, "water_available_in_litres"]
        i = i + 1

    watercost = {}
    i = 0
    for x in periods:
        watercost[x] = PeriodSheet.loc[i, "water_cost_per_litre"]
        i = i + 1

    manhoursavailable = {}
    i = 0
    for x in periods:
        manhoursavailable[x] = PeriodSheet.loc[i, "available_man_hours"]
        i = i + 1

    laborcost = {}
    i = 0
    for x in periods:
        laborcost[x] = PeriodSheet.loc[i, "labour_cost_per_man_hour"]
        i = i + 1

    fertilizercost = {}
    i = 0
    for x in periods:
        fertilizercost[x] = PeriodSheet.loc[i, "fertilizer_cost_per_kg"]
        i = i + 1

    fertilizerreqperacre = {}
    i = 0
    for x in periods:
        fertilizerreqperacre[x] = PeriodSheet.loc[i, "fertilizer_required_per_acre"]
        i += 1

    energycost = {}
    i = 0
    for x in periods:
        energycost[x] = PeriodSheet.loc[i, "energy_cost_per_unit"]
        i = i + 1

    # ProducePeriodSheet Variables
    purchasecost = {}
    i = 1
    for x in produce:
        j = 1
        for y in periods:
            purchasecost[x, y] = ProducePeriodSheet.cell_value(i, j)
            j += 1
        i += 1
    sellingprice = {}
    i = 11
    for x in produce:
        j = 1
        for y in periods:
            sellingprice[x, y] = ProducePeriodSheet.cell_value(i, j)
            j += 1
        i += 1
    demand = {}
    i = 21
    for x in produce:
        j = 1
        for y in periods:
            demand[x, y] = ProducePeriodSheet.cell_value(i, j)
            j += 1
        i += 1
    waterreqperkg = {}
    i = 30
    for x in produce:
        j = 1
        for y in periods:
            waterreqperkg[x, y] = ProducePeriodSheet.cell_value(i, j)
            j += 1
        i += 1
    yieldperacre = {}
    i = 40
    for x in produce:
        j = 1
        for y in periods:
            yieldperacre[x, y] = ProducePeriodSheet.cell_value(i, j)
            j += 1
        i += 1
    energyreqperkg = {}
    i = 50
    for x in produce:
        j = 1
        for y in periods:
            energyreqperkg[x, y] = ProducePeriodSheet.cell_value(i, j)
            j += 1
        i += 1

    # Create Optimization Model

    m = gp.Model("MultiPeriodFarmingModel")

    # Decision Variables

    ProduceSelect = m.addVars(produce, periods, vtype=GRB.BINARY, name="ProduceSelect")
    ProductionQty = m.addVars(
        produce, periods, vtype=GRB.CONTINUOUS, name="ProductionQty"
    )
    PurchaseQty = m.addVars(produce, periods, vtype=GRB.CONTINUOUS, name="PurchaseQty")
    ShippingQty = m.addVars(produce, periods, vtype=GRB.CONTINUOUS, name="ShippingQty")
    InventoryQty = m.addVars(
        produce, periods, vtype=GRB.CONTINUOUS, name="InventoryQty"
    )
    U = m.addVars(produce, periods, vtype=GRB.CONTINUOUS, name="U")
    OCC = m.addVars(periods, vtype=GRB.CONTINUOUS, name="OCC")
    V = m.addVars(periods, vtype=GRB.CONTINUOUS, name="V")

    # Constraints

    for j in produce:
        for t in periods:
            if t - harvestleadtime[j] > 0:
                a = ProductionQty[j, t - harvestleadtime[j]]
            else:
                a = 0
            if t - purchaseleadtime[j] > 0:
                b = PurchaseQty[j, t - purchaseleadtime[j] + 1]
            else:
                b = 0
            if t > 1:
                c = InventoryQty[j, t - 1]
            else:
                c = 0
            m.addConstr(
                a + b + (1 - fractionlost[j]) * c
                == ShippingQty[j, t] + InventoryQty[j, t],
                "InvBalanceConstraint",
            )

    for j in produce:
        for t in periods:
            m.addConstr(ShippingQty[j, t] == demand[j, t], "ShippingConstraint")
    for t in periods:
        m.addConstr(
            gp.quicksum(
                (manhoursreqperacre[j] * ProductionQty[j, t] / yieldperacre[j, t])
                for j in produce
            )
            <= manhoursavailable[t],
            "ManHoursConstraint",
        )

    for t in periods:
        m.addConstr(
            gp.quicksum(waterreqperkg[j, t] * ProductionQty[j, t] for j in produce)
            <= wateravailable[t],
            "WaterConstraint",
        )

    for j in produce:
        for t in periods:
            m.addConstr(
                ProductionQty[j, t] <= yieldperacre[j, t] * V[t] * ProduceSelect[j, t],
                "BigM",
            )

    for j in produce:
        for t in periods:
            if t - harvestleadtime[j] > 0:
                LB = t - harvestleadtime[j] + 1
            else:
                LB = 1

            m.addConstr(
                U[j, t]
                == gp.quicksum(
                    ProductionQty[j, tau] / yieldperacre[j, tau]
                    for tau in range(LB, t + 1)
                ),
                "LandConstraint_A",
            )

    for t in periods:
        m.addConstr(OCC[t] == gp.quicksum(U[j, t] for j in produce), "LandConstraint_B")

    for t in periods:
        x = max(t - 1, 1)
        m.addConstr(V[t] == LandAvailable - OCC[x], "LandConstraint_C")

    # Objective Function

    Revenue = gp.quicksum(
        sellingprice[j, t] * ShippingQty[j, t] for j in produce for t in periods
    )
    PurchaseCost = gp.quicksum(
        purchasecost[j, t] * PurchaseQty[j, t] for j in produce for t in periods
    )
    OperatingCost = gp.quicksum(
        (
            ProductionQty[j, t] * watercost[t] * waterreqperkg[j, t]
            + fertilizercost[t]
            * fertilizerreqperacre[t]
            * ProductionQty[j, t]
            / yieldperacre[j, t]
        )
        for j in produce
        for t in periods
    )
    LaborCost = gp.quicksum(
        laborcost[t] * manhoursreqperacre[j] * ProductionQty[j, t] / yieldperacre[j, t]
        for j in produce
        for t in periods
    )
    InventoryCost = gp.quicksum(
        InventoryQty[j, t] * invholdingcost[t] for j in produce for t in periods
    )

    Profit = Revenue - PurchaseCost - OperatingCost - LaborCost - InventoryCost

    m.setObjective(Profit, GRB.MAXIMIZE)

    m.setParam("MIPGap", 0.001)
    m.setParam("Timelimit", 36000)

    m.optimize()

    OutputFile = open("output/Output.txt", "a")
    OutputFile.truncate(0)
    OutputFile.write(
        "\n********Solution Results for Multi Period Farming Model with Sample Data*********"
    )
    OutputFile.write("\n")
    OutputFile.write("\nDataset: " + dataset)

    if m.status == GRB.OPTIMAL:

        ProduceSelectOut = m.getAttr("x", ProduceSelect)
        ProductionQtyOut = m.getAttr("x", ProductionQty)
        PurchaseQtyOut = m.getAttr("x", PurchaseQty)
        InventoryQtyOut = m.getAttr("x", InventoryQty)
        OCCOut = m.getAttr("x", OCC)
        VOut = m.getAttr("x", V)
        UOut = m.getAttr("x", U)

        OutputFile.write("\n\nThe following produce mix needs to be planted:\n\n")
        for t in periods:
            OutputFile.write("\nPERIOD %d:\n\n" % (t))
            x = max(t - 1, 1)
            if t != 1:
                OutputFile.write(
                    "Total Land Available for Planting at the beginning of period %d (V[t]): %0.2f \n\n"
                    % (t, VOut[t])
                )
                OutputFile.write("OCC[t-1] = OCC[%d] : %0.2f \n\n" % (x, OCCOut[x]))
            OutputFile.write("To Plant:\n\n")
            for j in produce:
                # if ProductionQtyOut[j,t] > 0:
                OutputFile.write(
                    "%0.2f kg of %s across %0.2f acres\n"
                    % (
                        ProductionQtyOut[j, t],
                        j,
                        (ProductionQtyOut[j, t] / yieldperacre[j, t]),
                    )
                )
                OutputFile.write(
                    "Total Land Used by %s at the end of period %d(UOut): %0.2f \n\n"
                    % (j, t, UOut[j, t])
                )

            OutputFile.write(
                "TOTAL LAND OCCUPIED AT THE END OF PERIOD %d (OCC[t]): %0.2f \n\n"
                % (t, OCCOut[t])
            )
            OutputFile.write("To Purchase (At the start of the period):\n\n")
            for j in produce:
                OutputFile.write("%0.2f kg of %s\n\n" % (PurchaseQtyOut[j, t], j))

        # OutputFile.write('\n\nThe following purchases are to be made:\n\n')
        # for t in periods:
        #     OutputFile.write('\nPeriod %d: \n' %(t))
        #     for j in produce:
        #         if PurchaseQtyOut[j,t] > 0:
        #             OutputFile.write('%0.2f kg of %s' % (PurchaseQtyOut[j,t],j))
        #             OutputFile.write("\n")

        OutputFile.write("\n\nInventory level at the end of each period:\n\n")
        for t in periods:
            OutputFile.write("\nPeriod %d: \n" % (t))
            for j in produce:
                OutputFile.write("%0.2f kg of %s" % (InventoryQtyOut[j, t], j))
                OutputFile.write("\n")

        OutputFile.write("\n\nLand Use:\n\n")
        for t in periods:
            OutputFile.write("\nPeriod %d: \n" % (t))
            OutputFile.write("\nOccupied: %0.2f\n" % (OCCOut[t]))
            OutputFile.write("\nAvailable: %0.2f\n" % (VOut[t]))

        OutputFile.write("\n\nRevenue: R%0.2f" % (Revenue.getValue()))
        OutputFile.write("\n\nPurchaseCost: R%0.2f" % (PurchaseCost.getValue()))
        OutputFile.write("\nOperatingCost: R%0.2f" % (OperatingCost.getValue()))
        OutputFile.write("\nLaborCost: R%0.2f" % (LaborCost.getValue()))
        OutputFile.write("\nInventoryCost: R%0.2f" % (InventoryCost.getValue()))
        OutputFile.write("\n\nNET PROFIT: R%0.2f" % (Profit.getValue()))

    # record program stop time
    stop = timeit.default_timer()
    runTime = stop - start
    OutputFile.write("\n\nRun time(calculated): %.2f" % runTime)
    OutputFile.write("\nRun time(Gurobi): %g seconds" % m.Runtime)
    OutputFile.close()
    m.write("model/model.lp")

    with open("output/Output.txt", "r") as file:
        contents = file.read()
        return contents
    # return JSONResponse(
    #     content={"message": "MultiPeriod Farming model optimized successfully"}
    # )
