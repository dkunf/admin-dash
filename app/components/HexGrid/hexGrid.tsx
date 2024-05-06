"use client";
import React from "react";
import Hexagon from "../Hexagon/Hexagon";
interface TbNames {
  tables: { table_name: string; column_name: string }[];
}
export default function HexGrid(props: TbNames) {
  type Position = "static" | "relative" | "absolute" | "fixed" | "sticky";
  type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
  const positioning = {
    // display: "flex",
    // flexWrap: "wrap" as FlexWrap,
    // justifyContent: "center",
    position: "relative" as Position,
  };

  let charWidth = 10; //rough estimate

  let biggestWidth =
    charWidth *
    Math.max.apply(
      null,
      props.tables.map((el) => el.table_name.length)
    );

  interface ColumnData {
    table_name: string;
    column_name: string;
  }
  type GroupedData = { [tableName: string]: string[] };

  //{tablename:[col1,col2...],...}
  const groupedData: GroupedData = props.tables.reduce(
    (acc: GroupedData, { table_name, column_name }: ColumnData) => {
      if (!acc[table_name]) {
        acc[table_name] = [];
      }
      acc[table_name].push(column_name);
      return acc;
    },
    {}
  );

  let pad = 10;
  let textWidth = biggestWidth + pad * 2; //we add pad from both sides so text cannot overflow
  let side = Math.round((1.15 * textWidth) / Math.sqrt(3));
  let viewportVal = Math.round(side * 2);
  let zeroZero = Math.round(viewportVal - textWidth) / 2;

  let ha = zeroZero;
  let hb = zeroZero + textWidth / 2;
  let hc = zeroZero + textWidth;

  let va = zeroZero;
  let vb = zeroZero + side / 4;
  let vc = zeroZero + side + side / 4;
  let vd = zeroZero + side + side / 4 + side / 4;

  let screenW;
  if (typeof window !== "undefined") {
    screenW = window.innerWidth;
  } else screenW = 0;

  let countLeft: number;
  let countTop: number;
  type Placement = [number, number];
  let coords: Placement[];
  let l = 0;
  let t = 0;

  let hSt = hb;
  let vSt = va;
  let row = vc - va;
  let iterations = 0;
  let i = 1;
  let tbCount = Object.keys(groupedData).length;

  coords = [[hSt - hb, vSt]];
  while (iterations <= tbCount + 1) {
    if (hSt + textWidth * i + textWidth / 2 < screenW) {
      coords.push([hSt + textWidth * i - hb, vSt]);
      iterations++;
    }
    //i=hc when even,otherwise i=hb again
    else {
      i = -1;
      hSt = hSt === hb ? hc : hb;
      vSt = vSt + row;
      iterations++;
    }
    i++;
  }
  console.log(coords);

  return (
    <>
      <div style={positioning}>
        {Object.keys(groupedData).map(
          (tableName, i) =>
            tableName[0] !== "_" && (
              <div
                key={tableName + tableName}
                style={{
                  position: "absolute",
                  left: coords[i][0],
                  top: coords[i][1],
                }}
              >
                <Hexagon
                  textWidth={biggestWidth}
                  key={tableName}
                  tableName={tableName}
                >
                  <>
                    <h2 className="text-xl">{tableName}</h2>
                    <ul className="ms-3 ">
                      {groupedData[tableName].map((column) => (
                        <li key={column}>{column}</li>
                      ))}
                    </ul>
                  </>
                </Hexagon>
              </div>
            )
        )}
      </div>
    </>
  );
}
