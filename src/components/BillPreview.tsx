
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share, Printer, X } from 'lucide-react';
import { BillData } from '../pages/Index';

interface BillPreviewProps {
  billData: BillData;
  showPreview: boolean;
  onClose: () => void;
}

export const BillPreview: React.FC<BillPreviewProps> = ({
  billData,
  showPreview,
  onClose
}) => {
  const generatePDF = async () => {
    // Import jsPDF dynamically
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Restaurant Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    const restaurantName = billData.restaurantInfo.name || 'Restaurant Name';
    doc.text(restaurantName, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    if (billData.restaurantInfo.address) {
      doc.text(billData.restaurantInfo.address, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
    }
    if (billData.restaurantInfo.phone) {
      doc.text(`Phone: ${billData.restaurantInfo.phone}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 6;
    }
    if (billData.restaurantInfo.gstNumber) {
      doc.text(`GST: ${billData.restaurantInfo.gstNumber}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }

    // Bill details
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
    
    doc.text(`Date: ${billData.date}`, 20, yPosition);
    if (billData.tableNumber) {
      doc.text(`Table: ${billData.tableNumber}`, pageWidth - 20, yPosition, { align: 'right' });
    }
    yPosition += 8;
    
    if (billData.customerName) {
      doc.text(`Customer: ${billData.customerName}`, 20, yPosition);
      yPosition += 8;
    }

    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // Items header
    doc.setFont(undefined, 'bold');
    doc.text('Item', 20, yPosition);
    doc.text('Qty', 100, yPosition);
    doc.text('Price', 130, yPosition);
    doc.text('Total', pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 6;
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;

    // Items
    doc.setFont(undefined, 'normal');
    billData.items.forEach(item => {
      doc.text(item.name, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(`₹${item.price.toFixed(2)}`, 130, yPosition);
      doc.text(`₹${item.total.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
      yPosition += 8;
    });

    // Totals
    yPosition += 5;
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    doc.text('Subtotal:', 130, yPosition);
    doc.text(`₹${billData.subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 8;

    doc.text(`GST (${billData.gstRate}%):`, 130, yPosition);
    doc.text(`₹${billData.gstAmount.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
    yPosition += 8;

    doc.setFont(undefined, 'bold');
    doc.text('Grand Total:', 130, yPosition);
    doc.text(`₹${billData.grandTotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

    // Footer
    yPosition += 20;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('Thank you for dining with us!', pageWidth / 2, yPosition, { align: 'center' });

    doc.save(`bill-${billData.tableNumber || 'bill'}-${Date.now()}.pdf`);
  };

  const shareViaWhatsApp = () => {
    const message = generateTextBill();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const generateTextBill = () => {
    const restaurantName = billData.restaurantInfo.name || 'Restaurant';
    let message = `🧾 Bill from ${restaurantName}\n`;
    
    if (billData.tableNumber) message += `Table: ${billData.tableNumber} | `;
    message += `Date: ${billData.date}\n`;
    message += '--------------------------------\n';
    
    billData.items.forEach(item => {
      message += `${item.name} x${item.quantity} - ₹${item.total.toFixed(2)}\n`;
    });
    
    message += '--------------------------------\n';
    message += `Subtotal: ₹${billData.subtotal.toFixed(2)}\n`;
    message += `GST (${billData.gstRate}%): ₹${billData.gstAmount.toFixed(2)}\n`;
    message += `Total: ₹${billData.grandTotal.toFixed(2)}\n`;
    message += '\nThank you for dining with us! 🍽️';
    
    return message;
  };

  const printBill = () => {
    window.print();
  };

  if (!showPreview) {
    return (
      <Card className="border-orange-200 shadow-lg sticky top-8">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              📄
            </div>
            <p className="text-lg">Bill preview will appear here</p>
            <p className="text-sm">Add items to generate your bill</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 shadow-lg">
      <CardContent className="p-0">
        {/* Actions Bar */}
        <div className="flex justify-between items-center p-4 bg-orange-50 border-b">
          <h3 className="font-semibold text-orange-800">Bill Preview</h3>
          <div className="flex gap-2">
            <Button onClick={generatePDF} size="sm" className="bg-blue-500 hover:bg-blue-600">
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button onClick={shareViaWhatsApp} size="sm" className="bg-green-500 hover:bg-green-600">
              <Share className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            <Button onClick={printBill} size="sm" variant="outline">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button onClick={onClose} size="sm" variant="outline">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="p-8 bg-white print:p-4" id="bill-content">
          {/* Restaurant Header */}
          <div className="text-center mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {billData.restaurantInfo.name || 'Restaurant Name'}
            </h1>
            {billData.restaurantInfo.address && (
              <p className="text-sm text-gray-600">{billData.restaurantInfo.address}</p>
            )}
            {billData.restaurantInfo.phone && (
              <p className="text-sm text-gray-600">Phone: {billData.restaurantInfo.phone}</p>
            )}
            {billData.restaurantInfo.gstNumber && (
              <p className="text-sm text-gray-600">GST: {billData.restaurantInfo.gstNumber}</p>
            )}
          </div>

          {/* Bill Details */}
          <div className="flex justify-between mb-6 text-sm">
            <div>
              <p><strong>Date:</strong> {billData.date}</p>
              {billData.customerName && (
                <p><strong>Customer:</strong> {billData.customerName}</p>
              )}
            </div>
            <div className="text-right">
              {billData.tableNumber && (
                <p><strong>Table:</strong> {billData.tableNumber}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {billData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-2">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-gray-300 pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>₹{billData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>GST ({billData.gstRate}%):</span>
              <span>₹{billData.gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Grand Total:</span>
              <span>₹{billData.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t">
            <p className="text-sm text-gray-600">Thank you for dining with us!</p>
            <p className="text-xs text-gray-500 mt-2">Visit us again soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
