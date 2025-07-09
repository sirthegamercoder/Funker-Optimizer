'''
MIT License

Copyright (c) 2025 MTGC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'''

import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox
import tkinter.simpledialog
from lxml import etree
from PIL import Image
import webbrowser
import winreg
from tkinter import ttk

class FunkerOptimizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Funker' Optimizer")
        self.root.iconbitmap(sys.executable)
        self.root.resizable(0, 0)

        window_width = 900
        window_height = 360
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x_screen = int((screen_width / 2) - (window_width / 2))
        y_screen = int((screen_height / 2) - (window_height / 2))
        self.root.geometry(f"{window_width}x{window_height}+{x_screen}+{y_screen}")

        self.root.grid_propagate(False)

        self.division_number = 2

        self.main_frame = tk.Frame(root)
        self.main_frame.pack(fill="both", expand=True, padx=10, pady=10)
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(1, weight=0)

        self.left_frame = tk.Frame(self.main_frame)
        self.left_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 10))
        self.left_frame.grid_columnconfigure(1, weight=1)

        self.input_label = tk.Label(self.left_frame, text="Input Data File:", font=("Segoe UI", 10, "bold"))
        self.input_label.grid(row=0, column=0, padx=5, pady=5, sticky="e")
        self.input_entry = tk.Entry(self.left_frame, width=55, font=("Segoe UI", 10))
        self.input_entry.grid(row=0, column=1, padx=5, pady=5, sticky="ew")
        self.input_button = tk.Button(self.left_frame, text="Browse", command=self.browse_input, font=("Segoe UI", 10))
        self.input_button.grid(row=0, column=2, padx=5, pady=5)

        self.output_label = tk.Label(self.left_frame, text="Output Data File:", font=("Segoe UI", 10, "bold"))
        self.output_label.grid(row=1, column=0, padx=5, pady=5, sticky="e")
        self.output_entry = tk.Entry(self.left_frame, width=55, font=("Segoe UI", 10))
        self.output_entry.grid(row=1, column=1, padx=5, pady=5, sticky="ew")
        self.output_button = tk.Button(self.left_frame, text="Browse", command=self.browse_output, font=("Segoe UI", 10))
        self.output_button.grid(row=1, column=2, padx=5, pady=5)

        self.button_frame = tk.Frame(self.left_frame)
        self.button_frame.grid(row=2, column=0, columnspan=3, pady=15, sticky="ew")
        self.button_frame.grid_columnconfigure(0, weight=1)
        self.button_frame.grid_columnconfigure(1, weight=1)
        self.button_frame.grid_columnconfigure(2, weight=1)

        self.batch_process_button = tk.Button(self.button_frame, text="Batch Process XML", command=self.batch_process, font=("Segoe UI", 10))
        self.batch_process_button.grid(row=0, column=0, padx=5, pady=5, sticky="ew")

        self.modify_button = tk.Button(self.button_frame, text="Modify XML", command=self.modify, font=("Segoe UI", 10))
        self.modify_button.grid(row=0, column=1, padx=5, pady=5, sticky="ew")

        self.github_button = tk.Button(self.button_frame, text="GitHub Repo", command=self.open_github_repo, font=("Segoe UI", 10))
        self.github_button.grid(row=0, column=2, padx=5, pady=5, sticky="ew")

        self.bug_report_button = tk.Button(self.button_frame, text="Bug Report", command=self.bug_report, font=("Segoe UI", 10))
        self.bug_report_button.grid(row=1, column=0, padx=5, pady=5, sticky="ew")

        self.spritesheet_and_xml_generator_button = tk.Button(self.button_frame, text="Spritesheet and XML Generator", command=self.spritesheet_and_xml_generator, font=("Segoe UI", 10))
        self.spritesheet_and_xml_generator_button.grid(row=1, column=1, columnspan=2, padx=5, pady=5, sticky="ew")

        self.message_text = tk.Text(self.left_frame, height=8, state='disabled', font=("Consolas", 10))
        self.message_text.grid(row=3, column=0, columnspan=3, padx=5, pady=10, sticky="nsew")
        self.left_frame.grid_rowconfigure(3, weight=1)

        self.right_frame = tk.Frame(self.main_frame, relief=tk.RIDGE, borderwidth=2)
        self.right_frame.grid(row=0, column=1, sticky="nsew", padx=(10, 0))
        self.right_frame.grid_columnconfigure(0, weight=1)

        self.image = None
        self.loaded_images = []
        self.image_label = None

        self.load_image_button = tk.Button(self.right_frame, text="Load Image", command=self.browse_image, font=("Segoe UI", 10))
        self.load_image_button.grid(row=0, column=0, padx=10, pady=(20,10), sticky="ew")

        self.resize_button = tk.Button(self.right_frame, text="Resize Image", command=self.resize, font=("Segoe UI", 10))
        self.resize_button.grid(row=1, column=0, padx=10, pady=10, sticky="ew")

        self.aliasing_var = tk.BooleanVar(value=True)
        self.aliasing_checkbox = tk.Checkbutton(self.right_frame, text="Aliasing", variable=self.aliasing_var, font=("Segoe UI", 10))
        self.aliasing_checkbox.grid(row=3, column=0, padx=10, pady=(10,20), sticky="w")

        self.image_file_display_label = tk.Label(self.right_frame, text="No image loaded", font=("Segoe UI", 9, "italic"))
        self.image_file_display_label.grid(row=4, column=0, padx=10, pady=(0,10), sticky="ew")

        self.apply_system_theme()

    def detect_system_theme(self):
        try:
            registry = winreg.ConnectRegistry(None, winreg.HKEY_CURRENT_USER)
            key_path = r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
            key = winreg.OpenKey(registry, key_path)
            value, _ = winreg.QueryValueEx(key, "AppsUseLightTheme")
            winreg.CloseKey(key)
            return "light" if value == 1 else "dark"
        except Exception:
            return "light"

    def apply_system_theme(self):
        theme = self.detect_system_theme()
        if theme == "dark":
            bg_color = "#2e2e2e"
            fg_color = "#ffffff"
            entry_bg = "#3c3f41"
            button_bg = "#444444"
            checkbox_indicator = "#555555"
        else:
            bg_color = "#f0f0f0"
            fg_color = "#000000"
            entry_bg = "#ffffff"
            button_bg = "#e0e0e0"
            checkbox_indicator = "#cccccc"

        self.root.configure(bg=bg_color)
        self.main_frame.configure(bg=bg_color)
        self.left_frame.configure(bg=bg_color)
        self.right_frame.configure(bg=bg_color)
        self.button_frame.configure(bg=bg_color)

        widgets = [
            self.input_label, self.input_entry, self.input_button,
            self.output_label, self.output_entry, self.output_button,
            self.modify_button, self.github_button, self.bug_report_button,
            self.spritesheet_and_xml_generator_button, self.message_text,
            self.load_image_button, self.resize_button,
            self.aliasing_checkbox, self.batch_process_button, self.image_file_display_label
        ]

        for widget in widgets:
            if isinstance(widget, tk.Label):
                widget.configure(bg=bg_color, fg=fg_color)
            elif isinstance(widget, tk.Entry):
                widget.configure(bg=entry_bg, fg=fg_color, insertbackground=fg_color, relief=tk.FLAT, bd=1)
            elif isinstance(widget, tk.Button):
                widget.configure(bg=button_bg, fg=fg_color, activebackground=button_bg, relief=tk.RAISED, bd=2)
            elif isinstance(widget, tk.Text):
                widget.configure(bg=entry_bg, fg=fg_color, insertbackground=fg_color, relief=tk.SUNKEN, bd=2)
            elif isinstance(widget, tk.Checkbutton):
                widget.configure(bg=bg_color, fg=fg_color, activebackground=button_bg, selectcolor=checkbox_indicator, relief=tk.FLAT)

    def browse_input(self):
        file_path = filedialog.askopenfilename(
            title="Select Input Data File",
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")]
        )
        if file_path:
            self.input_entry.delete(0, tk.END)
            self.input_entry.insert(0, file_path)

    def browse_output(self):
        file_path = filedialog.asksaveasfilename(
            title="Select Output Data File",
            defaultextension=".xml",
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")]
        )
        if file_path:
            self.output_entry.delete(0, tk.END)
            self.output_entry.insert(0, file_path)

    def modify(self):
        input_path = self.input_entry.get()
        output_path = self.output_entry.get()

        if not input_path or not os.path.isfile(input_path):
            messagebox.showerror("Error", "Please select a valid input data file.")
            return
        if not output_path:
            messagebox.showerror("Error", "Please select a valid output data file path.")
            return

        try:
            tree = etree.parse(input_path)
            root = tree.getroot()
            subtextures = tree.xpath('//SubTexture')

            for teste in subtextures:
                for attr in ['x', 'y', 'width', 'height', 'frameX', 'frameY', 'frameWidth', 'frameHeight']:
                    value = teste.get(attr)
                    if value is not None:
                        teste.set(attr, str(int(value) // self.division_number))

            tree.write(output_path, encoding='utf-8', xml_declaration=True)
            self.show_message(f"Modified Successfully.\nINPUT='{os.path.abspath(input_path)}'\nOUTPUT='{os.path.abspath(output_path)}'")

        except Exception as e:
            messagebox.showerror("Error", f"An unexpected error occurred:\n{e}")

    def batch_process(self):
        input_files = filedialog.askopenfilenames(
            title="Select Data Files",
            filetypes=[("XML files", "*.xml"), ("All files", "*.*")]
        )
        if not input_files:
            return

        output_dir = filedialog.askdirectory(title="Select Output Directory")
        if not output_dir:
            return

        errors = []
        for input_path in input_files:
            try:
                if not os.path.isfile(input_path):
                    errors.append(f"Invalid input file: {input_path}")
                    continue

                tree = etree.parse(input_path)
                subtextures = tree.xpath('//SubTexture')

                for teste in subtextures:
                    for attr in ['x', 'y', 'width', 'height', 'frameX', 'frameY', 'frameWidth', 'frameHeight']:
                        value = teste.get(attr)
                        if value is not None:
                            teste.set(attr, str(int(value) // self.division_number))

                base_name = os.path.basename(input_path)
                output_path = os.path.join(output_dir, base_name)
                tree.write(output_path, encoding='utf-8', xml_declaration=True)

            except Exception as e:
                errors.append(f"Error processing {input_path}: {e}")

        if errors:
            messagebox.showerror("Batch Processing Errors", "\n".join(errors))
        else:
            messagebox.showinfo("Batch Processing", "Batch processing completed successfully.")
            self.show_message("Batch XML processing completed successfully.")

    def show_message(self, message):
        self.message_text.config(state='normal')
        self.message_text.delete(1.0, tk.END)
        self.message_text.insert(tk.END, message)
        self.message_text.config(state='disabled')

    def browse_image(self):
        response = messagebox.askyesno(
            "Load Image Option",
            "Do you want to load a single image (Yes) or multiple images (No)?"
        )
        if response:
            self.browse_single_image()
        else:
            self.browse_multiple_images()

    def browse_single_image(self):
        file_path = filedialog.askopenfilename(
            title="Select Image File",
            filetypes=[("Image files", "*.png"), ("All files", "*.*")]
        )
        if file_path:
            try:
                self.image = Image.open(file_path)
                self.loaded_images = []
            except Exception as e:
                messagebox.showerror("Error", f"Failed to open image file:\n{e}")
                return

            file_name = os.path.basename(file_path)
            self.image_file_display_label.config(text=f"Loaded: {file_name}")
            self.show_message(f"Image loaded: {file_name}")

    def browse_multiple_images(self):
        file_paths = filedialog.askopenfilenames(
            title="Select Image Files",
            filetypes=[("Image files", "*.png"), ("All files", "*.*")]
        )
        if file_paths:
            self.loaded_images = []
            loaded_images_count = 0
            failed_to_load = []

            for file_path in file_paths:
                try:
                    img = Image.open(file_path)
                    self.loaded_images.append((file_path, img))
                    loaded_images_count += 1
                except Exception as e:
                    failed_to_load.append(f"{os.path.basename(file_path)}: {e}")
                    self.show_message(f"Failed to open {os.path.basename(file_path)}: {e}")

            if loaded_images_count > 0:
                self.image_file_display_label.config(text=f"Loaded {loaded_images_count} images.")
                self.show_message(f"Successfully loaded {loaded_images_count} images.")
                self.image = None
            else:
                self.image_file_display_label.config(text="No images loaded.")
                self.show_message("No images were loaded.")

            if failed_to_load:
                error_msg = "Some images failed to load:\n" + "\n".join(failed_to_load)
                messagebox.showwarning("Image Loading Warnings", error_msg)
                self.show_message(error_msg)

    def resize(self):
        response = messagebox.askyesno(
            "Resize Option",
            "Do you want to resize the currently loaded single image (Yes) or resize multiple images (No)?"
        )
        if response:
            self.resize_single_image()
        else:
            self.resize_multiple_images()

    def resize_single_image(self):
        if not (hasattr(self, 'image') and self.image):
            messagebox.showwarning("Warning", "No single image loaded to resize.")
            return

        percentage_str = tk.simpledialog.askstring("Resize Image", "Enter resize percentage (e.g. 50):")
        if percentage_str is None:
            return
        try:
            percentage = float(percentage_str)
            if percentage <= 0:
                raise ValueError("Percentage must be positive.")
        except Exception as e:
            messagebox.showerror("Invalid Input", f"Please enter a valid positive number.\n{e}")
            return

        original_width, original_height = self.image.size
        new_width = int(original_width * (percentage / 100))
        new_height = int(original_height * (percentage / 100))
        new_size = (new_width, new_height)

        if self.aliasing_var.get():
            resample_filter = Image.Resampling.LANCZOS
        else:
            resample_filter = Image.Resampling.NEAREST

        try:
            self.image = self.image.resize(new_size, resample_filter)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to resize image:\n{e}")
            return

        save_path = filedialog.asksaveasfilename(
            title="Save Resized Image",
            defaultextension=".png",
            filetypes=[("PNG files", "*.png"), ("All files", "*.*")]
        )
        if save_path:
            try:
                self.image.save(save_path)
                self.show_message(f"Resized image saved successfully:\n{os.path.abspath(save_path)}")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save image:\n{e}")

    def resize_multiple_images(self):
        if not self.loaded_images:
            messagebox.showwarning("Warning", "No images loaded for batch resizing.")
            return

        percentage_str = tk.simpledialog.askstring("Resize Image", "Enter resize percentage (e.g. 50):")
        if percentage_str is None:
            return
        try:
            percentage = float(percentage_str)
            if percentage <= 0:
                raise ValueError("Percentage must be positive.")
        except Exception as e:
            messagebox.showerror("Invalid Input", f"Please enter a valid positive number.\n{e}")
            return

        output_dir = filedialog.askdirectory(title="Select Output Directory for Resized Images")
        if not output_dir:
            return

        errors = []
        for file_path, img_obj in self.loaded_images:
            try:
                original_width, original_height = img_obj.size
                new_width = int(original_width * (percentage / 100))
                new_height = int(original_height * (percentage / 100))
                new_size = (new_width, new_height)

                if self.aliasing_var.get():
                    resample_filter = Image.Resampling.LANCZOS
                else:
                    resample_filter = Image.Resampling.NEAREST

                resized_img = img_obj.resize(new_size, resample_filter)

                base_name = os.path.basename(file_path)
                save_path = os.path.join(output_dir, base_name)
                resized_img.save(save_path)
            except Exception as e:
                errors.append(f"Failed to process {os.path.basename(file_path)}: {e}")

        if errors:
            error_message = "Image resizing completed with errors:\n" + "\n".join(errors)
            messagebox.showerror("Image Resizing Errors", error_message)
            self.show_message(error_message)
        else:
            messagebox.showinfo("Image Resizing", "Image resizing completed successfully.")
            self.show_message("Image resizing completed successfully.")


    def open_github_repo(self):
        url = "https://github.com/sirthegamercoder/Funker-Optimizer"
        webbrowser.open(url)

    def bug_report(self):
        url = "https://github.com/sirthegamercoder/Funker-Optimizer/issues"
        webbrowser.open(url)

    def spritesheet_and_xml_generator(self):
        url = "https://uncertainprod.github.io/FNF-Spritesheet-XML-generator-Web/"
        webbrowser.open(url)

if __name__ == '__main__':
    root = tk.Tk()
    app = FunkerOptimizer(root)
    root.mainloop()
