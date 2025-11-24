"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, Home, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
}

const OrderFailed = () => {
  
    const OrderDetails = {
    name: "string",
    phone: "string",
    email: "string",
    address: "string",
    deliveryTime: "string",
    paymentMethod: "string",
  };
  const total = 333.3;
  return (
    <>
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex mb-6"
            >
              <XCircle className="w-24 h-24 text-destructive" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">Payment Failed</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We couldn't process your payment. Please try again or use a different payment method.
            </p>

            <Card className="glass-card mb-8 text-left">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="text-muted-foreground">Order Amount</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium text-destructive">{OrderDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className="font-medium text-destructive">Failed</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Possible reasons for failure:</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Insufficient balance in your account</li>
                      <li>Incorrect payment details</li>
                      <li>Payment gateway timeout</li>
                      <li>Bank server issues</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    💡 Try using Cash on Delivery (COD) for a seamless experience
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cart">
                <Button size="lg" className="w-full sm:w-auto">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto glass-card">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div> */}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderFailed;
