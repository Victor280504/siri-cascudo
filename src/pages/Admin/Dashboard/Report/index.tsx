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
            <th className={styles.th}>Data</th>
            <th className={styles.th}>Qtde Pedidos</th>
            <th className={styles.th}>Receita</th>
            <th className={styles.th}>Despesas</th>
            <th className={styles.th}>Lucro</th>
            <th className={styles.th}>Comparativo</th>
          </tr>
        </thead>
        <tbody>
          {type === "weekly"
            ? reportItems.map((item) => (
                <tr key={item.date} className={styles.tr}>
                  <td className={styles.td}>
                    {new Date(item.date)
                      .toLocaleDateString("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      })
                      .replace(/^\w/, (c) => c.toUpperCase())
                      .replace(/\.$/, "")}
                  </td>
                  <td className={styles.td}>{item.totalOrders}</td>
                  <td className={styles.td}>
                    {item.revenue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className={styles.td}>
                    {item.expenses.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className={styles.td}>
                    {item.profit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td
                    className={styles.td}
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
              ))
            : Object.values(
                reportItems.reduce(
                  (acc: { [key: string]: MonthlyReport }, item) => {
                    const month = new Date(item.date).toLocaleDateString(
                      "pt-BR",
                      {
                        month: "short",
                      }
                    );
                    if (!acc[month]) {
                      acc[month] = {
                        ...item,
                        date: month,
                        totalOrders: 0,
                        revenue: 0,
                        expenses: 0,
                        profit: 0,
                        comparison: 0,
                      };
                    }
                    acc[month].totalOrders += item.totalOrders;
                    acc[month].revenue += item.revenue;
                    acc[month].expenses += item.expenses;
                    acc[month].profit += item.profit;
                    acc[month].comparison += item.comparison;
                    return acc;
                  },
                  {}
                )
              ).map((item) => (
                <tr key={item.date} className={styles.tr}>
                  <td className={styles.td}>
                    {item.date
                      .replace(/^\w/, (c) => c.toUpperCase())
                      .replace(/\.$/, "")}
                  </td>
                  <td className={styles.td}>{item.totalOrders}</td>
                  <td className={styles.td}>
                    {item.revenue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className={styles.td}>
                    {item.expenses.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className={styles.td}>
                    {item.profit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td
                    className={styles.td}
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
