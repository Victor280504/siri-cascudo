import styles from "./Report.module.css";
import { useState } from "react";
import Item from "../../../../components/ui/Item";
import { MonthlyReport, Report, WeeklyReport } from "../../../../types/Sale";
import { useQueryClient } from "@tanstack/react-query";

type ReportMenuProps = {
  report: Report;
};

const ReportMenu = ({ report }: ReportMenuProps) => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <Item.Col width={"90%"}>
        <ReportTable reportItems={report.weeklyReport} type={"weekly"} />
        <ReportTable reportItems={report.monthlyReport} type={"monthly"} />
      </Item.Col>
    </div>
  );
};

type ReportTableType = {
  reportItems: MonthlyReport[] | WeeklyReport[];
  type: "monthly" | "weekly";
};

const ReportTable = ({ reportItems, type }: ReportTableType) => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const queryClient = useQueryClient();

  const onUpdate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["report/all"] });
    setLastUpdated(new Date());
  };

  return (
    <Item.Col width={"100%"} margin={"0 0 50px 0"}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          backgroundColor: "#28356A",
          borderRadius: "20px 20px 0 0",
          padding: "25px 25px 15px 25px",
        }}
      >
        <Item.Row
          margin={0}
          width={"100%"}
          justifyContent="space-between"
          alignItems="center"
        >
          <Item.Text color="#F3F3F3" margin={0}>
            Vendas
          </Item.Text>
          <button className={styles.button} onClick={onUpdate}>
            <span
              className={`material-symbols-outlined secondary sm`}
              style={{ transform: "scaleX(-1)", rotate: "20deg" }}
            >
              replay
            </span>
            Atualizar
          </button>
        </Item.Row>
        <Item.Row
          color="#D2C0FF"
          margin={0}
          width={"100%"}
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Item.Text margin={0} fontSize="18px" fontWeight="200">
            Relatório {type == "monthly" ? "Mensal" : "Semanal"}
          </Item.Text>
          <Item.Text margin={0} fontSize="13px" fontWeight="200">
            Última atualização: {lastUpdated.toLocaleDateString()},{" "}
            {lastUpdated.toLocaleTimeString()}
          </Item.Text>
        </Item.Row>
      </div>
      <table
        className={styles.table}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#F3F3F3",
          borderRadius: "0 0 20px 20px",
        }}
      >
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <th>Data</th>
            <th>Qtde Pedidos</th>
            <th>Receita</th>
            <th>Despesas</th>
            <th>Lucro</th>
            <th>Comparativo</th>
          </tr>
        </thead>
        <tbody>
          {reportItems.map((item) => (
            <tr key={item.date}>
              <td>
                {type === "weekly"
                  ? new Date(item.date)
                      .toLocaleDateString("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })
                      .replace(/^\w/, (c) => c.toUpperCase())
                      .replace(/\.$/, "")
                  : new Date(item.date)
                      .toLocaleDateString("pt-BR", { month: "short" })
                      .replace(/^\w/, (c) => c.toUpperCase())
                      .replace(/\.$/, "")}
              </td>
              <td>{item.totalOrders}</td>
              <td>
                {item.revenue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                {item.expenses.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                {item.profit.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td
                style={{
                  color: item.comparison >= 0 ? "green" : "red",
                }}
              >
                {item.comparison >= 0 ? "+" : ""}
                {item.comparison.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
            </tr>
          ))}
          <tr style={{ height: "40px" }}></tr>
        </tbody>
      </table>
    </Item.Col>
  );
};

export default ReportMenu;
