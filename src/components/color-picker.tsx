"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface IColor {
  color1: string;
  color2: string;
  color3: string;
}

const ColorPicker = ({
  setColors,
}: {
  setColors: (colors: string[] | undefined) => void;
}) => {
  const [colors, setColorsValue] = React.useState<string[] | undefined |Partial<IColor> >();

  const onColorChange = React.useCallback(
    (color: Partial<IColor>) => {
      setColorsValue((prev) => {
        return{
          ...(prev ? prev : {}),
          ...color,
      }})
    },
    [setColorsValue]
  );
  
  React.useEffect(() => {
    if (!colors) return;
    setColors(Object.values(colors));
  }, [colors, setColors]);


  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-sans font-semibold">
          Choose your colors
        </CardTitle>
        <CardDescription>
          Pick three colors that match your mood.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Label className="" htmlFor="color1">
              Color 1
            </Label>
            <Input
              className="w-16 p-1"
              id="color1"
              placeholder="Color 1"
              type="color"
              onChange={(e) =>
                onColorChange({
                  color1: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label className="" htmlFor="color2">
              Color 2
            </Label>
            <Input
              className="w-16 p-1"
              id="color2"
              placeholder="Color 2"
              type="color"
              onChange={(e) =>
                onColorChange({
                  color2: e.target.value,
                })
              }
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label className="" htmlFor="color3">
              Color 3
            </Label>
            <Input
              className="w-16 p-1"
              id="color3"
              placeholder="Color 3"
              type="color"
              onChange={(e) =>
                onColorChange({
                  color3: e.target.value,
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default ColorPicker;
