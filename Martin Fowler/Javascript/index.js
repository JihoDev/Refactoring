const invoices = require("./data/invoices.json");
const plays = require("./data/plays.json");

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US",
                        { style: "currency", currency: "USD",
                          minimumFractionDigits: 2 }).format;

  for (let perf of invoice.performances) {
    // 포인트를 적립한다.
    volumeCredits += Math.max(perf.audience - 30, 0);
    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5); // 변수 인라인

    // 청구 내역을 출력한다.
    result += `  ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} 석)\n`; // 변수 인라인
    totalAmount += amountFor(perf);
  }
  result += `총액: ${format(totalAmount/100)}\n`;
  result += `적립 포인트: ${volumeCredits} 점\n`;
  return result;
}

// 필요 없어진 매개변수 제거
function amountFor(aPerformance) {
  let result = 0; // 변수를 초기화하는 코드
  switch (playFor(aPerformance).type) { // play를 playFor() 호출로 변경
    case "tragedy": // 비극
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy": // 희극
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`); // play를 playFor() 호출로 변경
  }
  return result; // 함수 안에서 값이 바뀌는 변수 반환
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function main() {
  try {
    console.log(statement(invoices[0], plays));
  } catch (error) {
    console.error(error);
  }
}

main();
