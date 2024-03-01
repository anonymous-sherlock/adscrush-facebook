"use client"
import { formatPrice } from '@/lib/utils';
import { bonus } from '@/server/api/bonus';
import { FC } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface DashboardBonusChartProps {
  data: Awaited<ReturnType<typeof bonus.monthlyAnalysis>>
}

const data = [
  { month: "January", bonus: { total: 2400 }, referral: { total: 500 } },
  { month: "February", bonus: { total: 500 }, referral: { total: 45.00 } },
  { month: "March", bonus: { total: 2400 }, referral: { total: 780 } },
  { month: "April", bonus: { total: 2400 }, referral: { total: 500 } },
  { month: "May", bonus: { total: 0 }, referral: { total: 40 } },
  { month: "June", bonus: { total: 100 }, referral: { total: 500 } },
  { month: "July", bonus: { total: 2300 }, referral: { total: 457 } },
  { month: "August", bonus: { total: 5000 }, referral: { total: 1200 } },
  { month: "September", bonus: { total: 0 }, referral: { total: 0 } },
  { month: "October", bonus: { total: 0 }, referral: { total: 500 } },
  { month: "November", bonus: { total: 0 }, referral: { total: 800 } },
  { month: "December", bonus: { total: 0 }, referral: { total: 1800 } },
];

export const DashboardBonusChart: FC<DashboardBonusChartProps> = ({ data }) => {

  const BonusName = "Bonus"
  const ReferralName = "Referral"

  return (
    <>
      <div className='flex flex-col md:flex-row gap-2 items-start justify-between md:items-center mb-2'>
        <p className="font-medium">Compare Bonus & Referral Performance</p>
      </div>

      <div className="chart">
        <div style={{ overflowX: 'auto' }}>

          <ResponsiveContainer width="100%" aspect={2 / 1}>
            <AreaChart
              width={730}
              height={250}
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="bonus.total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="referral.total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="gray" allowDataOverflow width={400} fontSize={12} tickCount={8} />
              <YAxis allowDataOverflow={true} fontSize={12} axisLine={false} tickLine={true} tick={true} width={60} tickMargin={0} tickCount={8}
                tickFormatter={(value, index) => formatPrice(value)}
              />
              <CartesianGrid strokeDasharray="3 2" className="chartGrid" />
              <CartesianGrid strokeDasharray="4" />
              <CartesianGrid strokeDasharray="4 1" />
              <CartesianGrid strokeDasharray="4 1 2" />
              <Tooltip formatter={(value, name, props) => [value, name]} />

              <Area type="monotone" name={BonusName} dataKey="bonus.total" stroke="#8884d8" fillOpacity={1} fill="url(#bonus.total)" />
              <Area type="monotone" name={ReferralName} dataKey="referral.total" stroke="#82ca9d" fillOpacity={1} fill="url(#referral.total)" />

            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </>
  )
}
