"use client";
import React from "react";
import styles from "./hexagon.module.css";
import Link from "next/link";

function Hexagon({
  tableName,
  textWidth,
  children,
}: {
  tableName: string;
  textWidth: number;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) {
  let pad = 10;
  textWidth = textWidth + pad * 2; //we add pad from both sides so text cannot overflow
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

  let coords = `${hb},${va} ${hc},${vb} ${hc},${vc} ${hb},${vd} ${ha},${vc} ${ha},${vb}`;
  let box = `0 0 ${viewportVal} ${viewportVal}`;

  let halfCharHeight = 8;
  let halfCharWidth = 5;

  const insertPos = {
    left: ha,
    top: vb,
    height: side,
    width: textWidth,
  };
  type Position = "static" | "relative" | "absolute" | "fixed" | "sticky";
  const buttonPos = {
    position: "absolute" as Position,
    left: hb - halfCharWidth,
    top: Math.round(va + (vb - va) / 2) - halfCharHeight,
    borderRadius: "5px",
  };

  return (
    <div className={styles.parent}>
      <svg
        width={viewportVal.toString()}
        height={viewportVal.toString()}
        viewBox={box}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points={coords} fill="none" stroke="white" strokeWidth="2" />
      </svg>

      <Link href={`./view-db/${tableName}`} style={buttonPos}>
        +
      </Link>
      <div className={styles.insert} style={insertPos}>
        <span className={styles.child}>{children}</span>
      </div>
    </div>
  );
}

export default Hexagon;
