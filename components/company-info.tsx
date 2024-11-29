'use client'

import React, { useState } from 'react';
import { Button, Input, Card, Typography, Space, Spin, message, Alert } from 'antd';
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import { FinancialCharts } from './financial-charts';

const { Text, Title, Paragraph } = Typography;

interface FinancialData {
  revenue: {
    data: number[] | null;
    period: string[] | null;
    source: string | null;
  };
  profit: {
    data: number[] | null;
    period: string[] | null;
    source: string | null;
  };
  summary: string;
  dataAvailability: string;
  lastUpdated: string;
}

export default function CompanyInfo() {
  const [companyName, setCompanyName] = useState('');
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCompanyInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch company information');
      }

      console.log('API Response:', data);
      
      if (!data.financials) {
        throw new Error('No financial data received');
      }

      setFinancialData(data.financials);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      message.error('Failed to fetch company information');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!financialData) return;

    const pdf = new jsPDF();
    
    pdf.setFontSize(16);
    pdf.text(companyName.toUpperCase(), 15, 20);
    
    pdf.setFontSize(12);
    const splitText = pdf.splitTextToSize(financialData.summary, 180);
    pdf.text(splitText, 15, 40);
    
    pdf.save(`${companyName}-financials.pdf`);
  };

  const renderFinancialSection = () => {
    if (!financialData) return null;

    const hasFinancialData = 
      financialData.revenue.data && 
      financialData.profit.data && 
      financialData.revenue.period;

    return (
      <Card 
        title={<span className="text-[#044462] font-bold">Financial Analysis</span>}
        className="shadow-sm"
        headStyle={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}
      >
        {hasFinancialData ? (
          <FinancialCharts 
            data={{
              revenue: financialData.revenue.data || [],
              profit: financialData.profit.data || [],
              dates: financialData.revenue.period || []
            }} 
          />
        ) : (
          <Alert
            message="Financial Data Not Available"
            description={
              <div className="space-y-2">
                <p>Financial data is not publicly available for this company.</p>
                <p>Data Availability: {financialData.dataAvailability}</p>
                {financialData.revenue.source && (
                  <p>Source: {financialData.revenue.source}</p>
                )}
              </div>
            }
            type="info"
            showIcon
            icon={<InfoCircleOutlined className="text-[#044462]" />}
            className="bg-[#f8f9fa]"
          />
        )}
      </Card>
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card 
        title={<span className="text-[#044462] font-bold">Company Research</span>}
        className="shadow-sm"
        headStyle={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="Enter company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onPressEnter={fetchCompanyInfo}
            className="border-[#e0e0e0] focus:border-[#009845] focus-visible:ring-[#009845]"
          />
          <Button 
            type="primary" 
            onClick={fetchCompanyInfo} 
            loading={loading}
            className="bg-[#009845] hover:bg-[#008038] border-none"
          >
            Get Information
          </Button>
        </Space>
      </Card>

      {loading && <Spin size="large" />}
      
      {error && <Text type="danger">{error}</Text>}
      
      {financialData && (
        <>
          <Card className="shadow-sm">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Title level={3} className="text-[#044462] mb-0">{companyName}</Title>
              <Paragraph className="text-[#666666] text-lg mt-2">
                {financialData.summary}
              </Paragraph>
              <div className="text-sm text-[#666666]">
                Last Updated: {financialData.lastUpdated}
              </div>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                onClick={downloadPDF}
                className="bg-[#009845] hover:bg-[#008038] border-none mt-4"
              >
                Download Report
              </Button>
            </Space>
          </Card>

          {renderFinancialSection()}
        </>
      )}
    </Space>
  );
} 